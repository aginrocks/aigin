import { Setting, SettingsGroup } from '@/components/settings';
import { ProviderSetting } from '@/components/settings/provider-setting';
import { GetProvidersOutput, useTRPC } from '@lib/trpc';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export function Providers() {
    const trpc = useTRPC();

    const { data: providers } = useQuery(trpc.models.providers.get.queryOptions());
    const queryClient = useQueryClient();

    useEffect(() => {
        // Prefetch providers to ensure they are available in the cache
        queryClient.refetchQueries(trpc.models.providers.get.queryOptions());
    });

    const providerMut = useMutation(trpc.models.providers.setEnabled.mutationOptions());

    return (
        <>
            <SettingsGroup title="Account">
                {providers?.map((provider: GetProvidersOutput[number]) => (
                    <ProviderSetting
                        key={provider.id}
                        title={provider.name}
                        onSwitchChange={(value) => {
                            providerMut.mutate({
                                provider: provider.id,
                                enabled: value,
                            });
                        }}
                        switchValue={provider.enabled}
                        switchDisabled={!provider.apiKeySet}
                        placeholder={provider?.apiKeySet ? 'Change API Key' : 'Enter API Key'}
                        onTextChange={(value) => {
                            providerMut.mutate({
                                provider: provider.id,
                                apiKey: value,
                            });
                        }}
                    />
                ))}
            </SettingsGroup>
        </>
    );
}
