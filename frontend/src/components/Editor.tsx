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
    const [editorHeight] = useState<string>('70vh');
    const editorRef = useRef<any>(null);

    const {
        code,
        setCode,
        handleTyping,
        participants,
        typingUsers,
        isConnected,
    } = useEditor({ roomId, username, initialCode });

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
            handleTyping(true);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg border-b border-gray-700">
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">
                        📝 {language.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-gray-500">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">
                        👥 {participants.length} online
                    </span>
                </div>
            </div>

            <div className="flex-1 relative">
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
                        fontFamily: 'Fira Code, monospace',
                        fontLigatures: true,
                        lineNumbers: 'on' as const,
                        roundedSelection: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
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
            {typingUsers.length > 0 && (
                <div className="bg-gray-800 px-4 py-2 rounded-b-lg border-t border-gray-700">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">
                            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                        </span>
                        <span className="animate-pulse">✏️</span>
                    </div>
                </div>
            )}
            <div className="bg-gray-800 px-4 py-1 rounded-b-lg border-t border-gray-700 flex justify-between text-xs text-gray-500">
                <span>Line: {editorRef.current?.getPosition?.()?.lineNumber || 1}</span>
                <span>Column: {editorRef.current?.getPosition?.()?.column || 1}</span>
                <span>Characters: {code.length}</span>
            </div>
        </div>
    );
};

export default CodeEditor;