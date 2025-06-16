import { CodeHighlighter, CodeHighlighterProps } from './code-highlighter';

export type CodeBlocks = {};

export function CodeBlock({ code, language }: CodeHighlighterProps) {
    return (
        <div>
            <CodeHighlighter code={code} language={language} />
        </div>
    );
}
