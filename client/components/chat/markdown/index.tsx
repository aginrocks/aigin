import CodeHighlighter from '@/components/code-highlighter';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export default function MarkdownRenderer({ children }: { children: string }) {
    return (
        <Markdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
                ul: ({ children, ...props }) => (
                    <ul className="list-disc leading-8" {...props}>
                        {children}
                    </ul>
                ),
                code: ({ children, className, node, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const lang = match?.[1];

                    if (!lang) {
                        return (
                            <code
                                className="max-w-full overflow-x-auto block whitespace-pre-wrap break-words"
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    }

                    return <CodeHighlighter code={children as string} language={lang} />;
                },
            }}
        >
            {children}
        </Markdown>
    );
}
