import { Outputs } from '@lib/trpc';
import { AsyncIterableData } from '@/components/sidebar-tiles';
import { Button } from './button';
import { useMutation } from '@tanstack/react-query';
import { useTRPC } from '@lib/trpc';
import { CodeHighlighter } from '../code-highlighter';

export type ToolCallData = AsyncIterableData<Outputs['chat']['stream']> & {
    type: 'tool:call-metadata';
};

export type ToolCallProps = {
    data?: ToolCallData['data'][0];
    args: any;
    callId: string;
    toolName: string;
    onConfirm?: () => void;
};

export function ToolCall({ data, callId, toolName, args, onConfirm }: ToolCallProps) {
    const trpc = useTRPC();

    const confirmCall = useMutation(
        trpc.chat.confirmMCPCall.mutationOptions({
            onSuccess: () => {
                onConfirm?.();
            },
        })
    );

    return (
        <div className="border rounded-md p-4 bg-popover/80">
            <div className="flex items-center mb-1 gap-2 justify-between">
                <div>
                    <div className="text-sm font-medium">{data?.app.name}</div>
                    <div className="text-xs text-muted-foreground">{data?.app.description}</div>
                </div>
                {data?.app.icon && (
                    <img src={data.app.icon} alt={`${data.app.name} icon`} className="h-8" />
                )}
            </div>

            <div className="font-semibold">{toolName}</div>

            <div className="flex flex-col gap-4">
                {args && (
                    <div className="mt-2 overflow-hidden border rounded-sm">
                        <CodeHighlighter language="json" code={JSON.stringify(args, null, 4)} />
                    </div>
                )}

                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() =>
                            confirmCall.mutate({
                                callId,
                                canContinue: false,
                            })
                        }
                        disabled={confirmCall.isPending}
                    >
                        Deny
                    </Button>
                    <Button
                        onClick={() =>
                            confirmCall.mutate({
                                callId,
                                canContinue: true,
                            })
                        }
                        disabled={confirmCall.isPending}
                    >
                        Allow
                    </Button>
                </div>
            </div>
        </div>
    );
}
