import { Setting, SettingsGroup } from '@/components/settings';
import { ProviderSetting } from '@/components/settings/provider-setting';
import { GetProvidersOutput, useTRPC } from '@lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';

export function Providers() {
    const trpc = useTRPC();

    const { data: providers } = useQuery(trpc.models.providers.get.queryOptions());

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
                        placeholder={provider?.apiKeySet ? 'Change API Key' : 'Enter API Key'}
                        switchDisabled={!provider.apiKeySet}
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
