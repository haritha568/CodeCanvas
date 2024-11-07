import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $createTextNode,
  TextNode,
  $createParagraphNode,
  TextFormatType,
  $getSelection,
  $isRangeSelection,
  RangeSelection,
  LexicalNode,
  LexicalEditor
} from "lexical";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react-dom";

interface SuggestionsMenuProps {
    suggestions: {
      words: string[];
      sentences: string[];
    };
    position: { x: number; y: number } | null;
    onSelect: (text: string, type: 'word' | 'sentence') => void;
    onClose: () => void;
  }
  
  interface TextSuggestion {
    type: 'word' | 'sentence';
    text: string;
  }

  export function SpellCheckPlugin() {
    const [editor] = useLexicalComposerContext();
    const [misspelledWords, setMisspelledWords] = useState<Set<string>>(new Set());
    const [suggestions, setSuggestions] = useState<{ words: string[], sentences: string[] }>({
      words: [],
      sentences: []
    });
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
  
    // Helper function to get DOM range from Lexical selection
    const getDOMRangeFromSelection = (
      editor: LexicalEditor,
      selection: RangeSelection
    ): Range | null => {
      const anchor = selection.anchor;
      const focus = selection.focus;
      const anchorNode = editor.getElementByKey(anchor.key);
      const focusNode = editor.getElementByKey(focus.key);
      
      if (!anchorNode || !focusNode) return null;
  
      const range = document.createRange();
      let anchorDOM: Node | null = anchorNode;
      let focusDOM: Node | null = focusNode;
  
      if ($isTextNode(anchor.getNode())) {
        anchorDOM = anchorNode.firstChild || anchorNode;
      }
      if ($isTextNode(focus.getNode())) {
        focusDOM = focusNode.firstChild || focusNode;
      }
  
      if (!anchorDOM || !focusDOM) return null;
  
      try {
        range.setStart(anchorDOM, anchor.offset);
        range.setEnd(focusDOM, focus.offset);
        return range;
      } catch (error) {
        console.error('Error creating range:', error);
        return null;
      }
    };

  // Function to get position from DOM range
  const getPositionFromRange = (range: Range): { x: number; y: number } | null => {
    const rect = range.getBoundingClientRect();
    if (!rect) return null;
    
    return {
      x: rect.right + window.scrollX,
      y: rect.bottom + window.scrollY
    };
  };

  // Function to check spelling
  const checkSpelling = (word: string): boolean => {
    if (!word || word.length < 2) return false;
    
    const textarea = document.createElement('textarea');
    textarea.style.display = 'none';
    document.body.appendChild(textarea);
    textarea.value = word;
    const misspelled = textarea.spellcheck && !textarea.checkValidity();
    document.body.removeChild(textarea);
    return misspelled;
  };

  // Function to get text suggestions
  const getSuggestions = async (text: string): Promise<{ words: string[], sentences: string[] }> => {
    try {
      // Get word suggestions for the last word
      const lastWord = text.split(/\s+/).pop() || '';
      const wordResponse = await fetch(`https://api.datamuse.com/words?sp=${lastWord}&max=5`);
      const wordData = await wordResponse.json();
      const words = wordData.map((item: { word: string }) => item.word);

      // Get sentence completions
      const sentences = await getSentenceCompletions(text);

      return {
        words: words || [],
        sentences: sentences || []
      };
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return {
        words: [],
        sentences: []
      };
    }
  };

  // Function to get sentence completions
  const getSentenceCompletions = async (text: string): Promise<string[]> => {
    // This is a mock implementation - replace with your actual API call
    const completions = [
      text + " is a great example of",
      text + " can be used to demonstrate",
      text + " shows how we can"
    ];
    return completions;
  };

  // Handle text selection from suggestions
  const handleTextSelection = (selectedText: string, type: 'word' | 'sentence') => {
    editor.update(() => {
      const selection = $getSelection();
      
      if (!selection || !$isRangeSelection(selection)) return;

      if (type === 'word' && selectedWord) {
        const nodes = selection.getNodes();
        nodes.forEach((node: LexicalNode) => {
          if ($isTextNode(node) && node.getTextContent() === selectedWord) {
            node.setTextContent(selectedText);
          }
        });
      } else if (type === 'sentence') {
        const paragraph = $createParagraphNode();
        const textNode = $createTextNode(selectedText);
        paragraph.append(textNode);
        selection.insertNodes([paragraph]);
      }
    });

    setSelectedWord(null);
    setSuggestions({ words: [], sentences: [] });
    setMenuPosition(null);
  };

  // Add styles for misspelled words
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .misspelled {
        text-decoration: underline;
        text-decoration-style: wavy;
        text-decoration-color: red;
        cursor: pointer;
      }
      .suggestion-active {
        background-color: rgba(59, 130, 246, 0.1);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Handle text input and suggestions
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleTextInput = async () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!selection || !$isRangeSelection(selection)) return;

        const node = selection.anchor.getNode();
        if (!$isTextNode(node)) return;

        const text = node.getTextContent();
        const lastWord = text.split(/\s+/).pop() || '';

        if (checkSpelling(lastWord) || text.length > 10) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(async () => {
            const newSuggestions = await getSuggestions(text);
            setSuggestions(newSuggestions);
            
            const range = getDOMRangeFromSelection(editor, selection);
            if (range) {
              const position = getPositionFromRange(range);
              if (position) {
                setMenuPosition(position);
              }
            }
          }, 500);
        } else {
          setMenuPosition(null);
          setSuggestions({ words: [], sentences: [] });
        }
      });
    };

    const removeUpdateListener = editor.registerUpdateListener(handleTextInput);
    
    return () => {
      removeUpdateListener();
      clearTimeout(timeoutId);
    };
  }, [editor]);

  // Render suggestions menu
  return menuPosition && (suggestions.words.length > 0 || suggestions.sentences.length > 0) ? (
    <SuggestionsMenu
      suggestions={suggestions}
      position={menuPosition}
      onSelect={handleTextSelection}
      onClose={() => {
        setSelectedWord(null);
        setSuggestions({ words: [], sentences: [] });
        setMenuPosition(null);
      }}
    />
  ) : null;
}

// Suggestions menu component
function SuggestionsMenu({
  suggestions,
  position,
  onSelect,
  onClose
}: SuggestionsMenuProps) {
  const {
    refs,
    floatingStyles,
  } = useFloating({
    placement: "bottom-start",
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const floating = refs.floating.current;
      if (floating && !(floating as HTMLElement).contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [refs.floating, onClose]);

  return createPortal(
    <div
      ref={refs.floating as React.RefObject<HTMLDivElement>}
      style={{
        ...floatingStyles,
        position: "absolute",
        top: position?.y,
        left: position?.x,
      }}
      className="suggestions-menu z-50 min-w-[300px] max-w-[400px] overflow-hidden rounded-md border border-border/80 bg-popover p-1 text-popover-foreground shadow-md"
    >
      <div className="flex flex-col gap-2">
        {suggestions.words.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
              Word Suggestions
            </div>
            <div className="flex flex-col gap-1">
              {suggestions.words.map((word, index) => (
                <button
                  key={`word-${index}`}
                  onClick={() => onSelect(word, 'word')}
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground outline-none"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {suggestions.sentences.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
              Complete Sentence
            </div>
            <div className="flex flex-col gap-1">
              {suggestions.sentences.map((sentence, index) => (
                <button
                  key={`sentence-${index}`}
                  onClick={() => onSelect(sentence, 'sentence')}
                  className="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground outline-none text-left"
                >
                  {sentence}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// Type guard for TextNode
function $isTextNode(node: LexicalNode): node is TextNode {
  return node instanceof TextNode;
}

export function Placeholder() {
    return (
      <div className="pointer-events-none absolute top-[25px] left-[100px] text-sm text-muted-foreground">
        Start typing...
      </div>
    );
  }
  
  export default SpellCheckPlugin;