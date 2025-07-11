import { IconArrowRight, IconKey, IconMessage } from '@tabler/icons-react';
import { OnboardingHeader } from '../onboarding-header';
import { GetProvidersOutput, useTRPC } from '@lib/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ProviderSetting } from '@/components/settings/provider-setting';
import { SettingsGroup } from '@/components/settings';
import { Button } from '@/components/ui/button';

type ProvidersSetupProps = {
    onClick: () => void;
};

export default function ProvidersSetup({ onClick }: ProvidersSetupProps) {
    const trpc = useTRPC();

    const { data: providers } = useQuery(trpc.models.providers.get.queryOptions());

    const providerMut = useMutation(trpc.models.providers.setEnabled.mutationOptions());

    return (
        <div className="flex flex-col gap-4">
            <OnboardingHeader
                title="Let's set up your chat"
                description="Choose the providers you'd like to use and configure your API keys."
                icon={IconKey}
            />
            <SettingsGroup>
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
            <div className="flex justify-end mt-4">
                <Button onClick={onClick} size="lg">
                    Next
                    <IconArrowRight />
                </Button>
            </div>
        </div>
    );
}
