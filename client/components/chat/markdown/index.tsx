import { CodeBlock } from '@/components/codeblock';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@lib/utils';
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
                        <ul className="list-disc list-inside leading-8" {...props}>
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
                    hr: ({ ...props }) => <hr className="my-4 border-t border-border" {...props} />,
                    h1: ({ children, ...props }) => (
                        <h1 className="text-2xl font-bold mb-2" {...props}>
                            {children}
                        </h1>
                    ),
                    h2: ({ children, ...props }) => (
                        <h2 className="text-xl font-semibold mb-2" {...props}>
                            {children}
                        </h2>
                    ),
                    h3: ({ children, ...props }) => (
                        <h3 className="text-lg font-semibold mb-2" {...props}>
                            {children}
                        </h3>
                    ),
                    a: ({ children, ...props }) => (
                        <a
                            className="text-primary-text-light hover:underline"
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </a>
                    ),
                    table: ({ children, className, ...props }) => (
                        <Table
                            className={cn(
                                'border rounded-md max-w-full overflow-hidden',
                                className
                            )}
                            {...props}
                        >
                            {children}
                        </Table>
                    ),
                    thead: ({ children, ...props }) => <TableHeader>{children}</TableHeader>,
                    tbody: ({ children, ...props }) => <TableBody>{children}</TableBody>,
                    th: ({ children, ...props }) => <TableHead>{children}</TableHead>,
                    tr: ({ children, ...props }) => <TableRow>{children}</TableRow>,
                    td: ({ children, ...props }) => <TableCell>{children}</TableCell>,
                }}
            >
                {children}
            </Markdown>
        </div>
    );
}
