import { CodeHighlighter, CodeHighlighterProps } from './code-highlighter';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export function CodeBlock({ code, language }: CodeHighlighterProps) {
    return (
        <div className="my-3">
            <ScrollArea className="rounded-md outline -outline-offset-1 outline-border bg-[#232137]">
                <CodeHighlighter code={code} language={language} />
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
