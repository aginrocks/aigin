import { CodeBlock } from '@/components/codeblock';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export default function MarkdownRenderer({ children }: { children: string }) {
    return (
        <div className="leading-relaxed">
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
                        const isInline = node?.position?.start?.line === node?.position?.end?.line;

                        const match = /language-(\w+)/.exec(className || '');
                        const lang = match?.[1] || 'text';

                        if (isInline) {
                            return (
                                <span
                                    className="px-1.5 py-0.5 rounded-sm bg-accent text-accent-foreground font-mono text-sm"
                                    {...props}
                                >
                                    {children}
                                </span>
                            );
                        }

                        return <CodeBlock code={children as string} language={lang} />;
                    },
                }}
            >
                {children}
            </Markdown>
        </div>
    );
}
