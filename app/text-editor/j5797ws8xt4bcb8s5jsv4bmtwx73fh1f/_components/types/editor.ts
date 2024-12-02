// types.ts
export type EditorTheme = {
    paragraph: string;
    text: {
      bold: string;
      italic: string;
      underline: string;
      strikethrough: string;
    };
  };
  
  export type InitialConfigType = {
    namespace: string;
    theme: EditorTheme;
    onError: (error: Error) => void;
  };