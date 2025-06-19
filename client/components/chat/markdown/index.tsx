import { CodeBlock } from '@/components/codeblock';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { IconCopy } from '@tabler/icons-react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import Copy from './copy';

export default function MarkdownRenderer({ children }: { children: string }) {
    return (
        <div className=" flex flex-col">
            <div className="leading-relaxed px-2">
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
                            const isInline =
                                node?.position?.start?.line === node?.position?.end?.line;

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
                        hr: ({ ...props }) => (
                            <hr className="my-4 border-t border-border" {...props} />
                        ),
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
                        table: ({ children, ...props }) => (
                            <div className="border rounded-md my-3">
                                <Table className="max-w-full" {...props}>
                                    {children}
                                </Table>
                            </div>
                        ),
                        thead: ({ children, ...props }) => (
                            <TableHeader {...props}>{children}</TableHeader>
                        ),
                        tbody: ({ children, ...props }) => (
                            <TableBody {...props}>{children}</TableBody>
                        ),
                        th: ({ children, ...props }) => (
                            <TableHead {...props}>{children}</TableHead>
                        ),
                        tr: ({ children, ...props }) => <TableRow {...props}>{children}</TableRow>,
                        td: ({ children, ...props }) => (
                            <TableCell {...props}>{children}</TableCell>
                        ),
                    }}
                >
                    {children}
                </Markdown>
            </div>
            <div className="pl-1 pt-1">
                <Copy content={children} />
            </div>
        </div>
    );
}
