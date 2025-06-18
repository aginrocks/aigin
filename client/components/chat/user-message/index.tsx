type UserMessageProps = {
    children?: React.ReactNode;
};

export default function UserMessage({ children }: UserMessageProps) {
    return (
        <div className="w-full max-w-4xl min-h-fit flex justify-end">
            <div className="bg-popover/80 border rounded-2xl flex flex-col px-4 py-3 max-w-[80%]">
                <div className="text-base text-foreground whitespace-pre-line">{children}</div>
            </div>
        </div>
    );
}
