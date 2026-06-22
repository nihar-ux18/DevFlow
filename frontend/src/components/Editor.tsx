import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useEditor } from '../hooks/useEditor';
import { EditorProps } from '../types';

const CodeEditor: React.FC<EditorProps> = ({
  roomId,
  initialCode = '// Welcome to DevCollab!\n// Start coding together...',
  language = 'javascript',
  username = 'Anonymous'
}) => {
  const [editorHeight] = useState<string>('calc(100vh - 120px)');
  const [line, setLine] = useState<number>(1);
  const [column, setColumn] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const {
    code,
    setCode,
    handleTyping,
    typingUsers,
    isConnected,
  } = useEditor({ roomId, username, initialCode });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    editor.onDidChangeCursorPosition((e: any) => {
      setLine(e.position.lineNumber);
      setColumn(e.position.column);
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      handleTyping(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      {/* Editor Toolbar */}
      <div className="h-10 border-b border-outline-variant bg-surface-container-low flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface cursor-pointer select-none">
            <span className="material-symbols-outlined text-[18px]">code</span>
            <span className="font-label-sm text-label-sm">index.{language === 'python' ? 'py' : 'tsx'}</span>
          </div>
          <div className="h-4 w-[1px] bg-outline-variant"></div>
          <span className="text-on-surface-variant font-label-sm text-label-sm uppercase select-none">
            {language}
          </span>
          <div className="h-4 w-[1px] bg-outline-variant"></div>
          <div className="flex items-center space-x-2 select-none">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors font-label-sm text-label-sm bg-transparent cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">share</span>
            Share
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1 rounded bg-primary text-on-primary hover:opacity-90 transition-all font-label-sm text-label-sm cursor-pointer border-none">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            Run
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-grow relative overflow-hidden">
        <Editor
          height={editorHeight}
          language={language.toLowerCase()}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            lineNumbers: 'on' as const,
            roundedSelection: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on' as const,
            formatOnPaste: true,
            formatOnType: true,
            renderWhitespace: 'selection' as const,
            cursorBlinking: 'smooth' as const,
            cursorSmoothCaretAnimation: 'on' as const,
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            suggest: {
              showKeywords: true,
              showFunctions: true,
              showVariables: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            acceptSuggestionOnEnter: 'on' as const,
            snippetSuggestions: 'top' as const,
          }}
        />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="bg-[#0b141c] px-4 py-1.5 border-t border-outline-variant text-xs text-on-surface-variant flex items-center gap-2">
          <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
          <span className="animate-pulse">✏️</span>
        </div>
      )}

      <div className="bg-[#0b141c] px-4 py-1 border-t border-outline-variant flex justify-between text-xs text-outline font-code-md opacity-75 select-none">
        <span>Line: {line}</span>
        <span>Column: {column}</span>
        <span>Characters: {code.length}</span>
      </div>
    </div>
  );
};

export default CodeEditor;