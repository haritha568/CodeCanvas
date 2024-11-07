import React, { useState, useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  $getSelection,
  $createRangeSelection,
  $setSelection,
  $isRangeSelection,
  TextNode,
} from 'lexical';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Match {
  nodeKey: string;
  start: number;
  end: number;
  text: string;
}

export function FindReplace({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [editor] = useLexicalComposerContext();
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

  // Function to get all text nodes from the editor
  const getAllTextNodes = useCallback(() => {
    const textNodes: TextNode[] = [];
    
    editor.getEditorState().read(() => {
      const root = $getRoot();

      const traverseNodes = (node: any) => {
        if (node instanceof TextNode) {
          textNodes.push(node);
        }
        node.getChildren().forEach(traverseNodes);
      };

      traverseNodes(root);
    });

    return textNodes;
  }, [editor]);

  // Improved find function
  const findAll = useCallback(() => {
    const searchText = findText.trim().toLowerCase();
    if (!searchText) {
      setMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    const newMatches: Match[] = [];

    editor.getEditorState().read(() => {
      const textNodes = getAllTextNodes();
      
      textNodes.forEach((node) => {
        const text = node.getTextContent().toLowerCase();
        let startIndex = 0;
        
        while (true) {
          const index = text.indexOf(searchText, startIndex);
          if (index === -1) break;

          newMatches.push({
            nodeKey: node.getKey(),
            start: index,
            end: index + searchText.length,
            text: node.getTextContent().slice(index, index + searchText.length)
          });

          startIndex = index + 1;
        }
      });
    });

    setMatches(newMatches);
    if (newMatches.length > 0 && currentMatchIndex === -1) {
      setCurrentMatchIndex(0);
      highlightMatch(newMatches[0]);
    }
  }, [editor, findText, getAllTextNodes]);

  // Highlight a specific match
  const highlightMatch = useCallback((match: Match) => {
    editor.update(() => {
      const selection = $createRangeSelection();
      const node = editor.getElementByKey(match.nodeKey);

      if (node) {
        selection.anchor.set(match.nodeKey, match.start, 'text');
        selection.focus.set(match.nodeKey, match.end, 'text');
        $setSelection(selection);

        // Scroll the match into view
        const element = editor.getElementByKey(match.nodeKey);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }, [editor]);

  // Navigate between matches
  const navigateMatches = useCallback((direction: 'next' | 'prev') => {
    if (matches.length === 0) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = currentMatchIndex + 1 >= matches.length ? 0 : currentMatchIndex + 1;
    } else {
      newIndex = currentMatchIndex - 1 < 0 ? matches.length - 1 : currentMatchIndex - 1;
    }

    setCurrentMatchIndex(newIndex);
    highlightMatch(matches[newIndex]);
  }, [matches, currentMatchIndex, highlightMatch]);

  // Replace current match
  const replaceMatch = useCallback(() => {
    if (matches.length === 0 || currentMatchIndex === -1) return;

    editor.update(() => {
      const match = matches[currentMatchIndex];
      const node = editor.getElementByKey(match.nodeKey);

      if (node instanceof TextNode) {
        const text = node.getTextContent();
        const newText = text.slice(0, match.start) + replaceText + text.slice(match.end);
        node.setTextContent(newText);
      }
    });

    // Refresh matches after replacement
    setTimeout(findAll, 0);
  }, [editor, matches, currentMatchIndex, replaceText, findAll]);

  // Replace all matches
  const replaceAll = useCallback(() => {
    if (matches.length === 0) return;

    editor.update(() => {
      // Process nodes in reverse order to maintain indices
      [...matches].reverse().forEach(match => {
        const node = editor.getElementByKey(match.nodeKey);
        if (node instanceof TextNode) {
          const text = node.getTextContent();
          const newText = text.slice(0, match.start) + replaceText + text.slice(match.end);
          node.setTextContent(newText);
        }
      });
    });

    // Refresh matches after replacement
    setTimeout(findAll, 0);
  }, [editor, matches, replaceText, findAll]);

  // Update matches when search text changes
  useEffect(() => {
    const timeoutId = setTimeout(findAll, 100);
    return () => clearTimeout(timeoutId);
  }, [findText, findAll]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find and Replace
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Find input */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Find text..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <span className="text-sm text-muted-foreground min-w-[60px] text-center">
              {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : '0/0'}
            </span>
          </div>

          {/* Replace input */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Replace with..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="flex-1"
            />
          </div>

          {/* Navigation and action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigateMatches('prev')}
                disabled={matches.length === 0}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigateMatches('next')}
                disabled={matches.length === 0}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={replaceMatch}
                disabled={matches.length === 0 || currentMatchIndex === -1}
              >
                Replace
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={replaceAll}
                disabled={matches.length === 0}
              >
                Replace All
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
