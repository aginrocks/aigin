import { useTRPC } from '@lib/trpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSetSettings() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const settingMut = useMutation(
        trpc.settings.setUserSettings.mutationOptions({
            onMutate: async (m) => {
                const queryKey = trpc.settings.getUserSettings.queryKey();

                await queryClient.cancelQueries({ queryKey });

                const previousSettings = queryClient.getQueryData(queryKey);
                queryClient.setQueryData(queryKey, (old: any) => ({
                    ...old,
                    ...m,
                }));
                return { previousSettings };
            },
        })
    );

    return settingMut;
}
