import {
    IconArrowRight,
    IconCloud,
    IconCode,
    IconMessage,
    IconSparkles,
    IconTool,
} from '@tabler/icons-react';
import { OnboardingHeader } from '../onboarding-header';
import { Feature } from '../feature';
import { Button } from '@/components/ui/button';

type welcomeProps = {
    onClick: () => void;
};

export default function Welcome({ onClick }: welcomeProps) {
    return (
        <>
            <OnboardingHeader
                title="Welcome to Aigin"
                description="Next-generation AI chat platform with extensive model support and powerful extensibility"
                icon={IconSparkles}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
                <Feature
                    icon={IconMessage}
                    title="Chat with different models"
                    description="Seamlessly switch between OpenAI, Anthropic, Google, Groq, DeepSeek, XAI, Azure, and OpenRouter"
                />
                <Feature
                    icon={IconTool}
                    title="More than just a chat"
                    description="Aigin seamlessly integrates with your workflow. It cah search the web for you, manage your databases, write notes and more"
                />
                <Feature
                    icon={IconCloud}
                    title="Seamless Synchronization"
                    description="Access your chats wherever you are. All of your chats are stored on the server for easy access and convenience."
                />
                <Feature
                    icon={IconCode}
                    title="Free and Open Source"
                    description="Aigin is freely available and is licensed under the MIT License. If you'd like to learn more about the project, you can check out our GitHub repository."
                />
            </div>
            <div className="flex justify-end mt-4">
                <Button size="lg" onClick={onClick}>
                    Next
                    <IconArrowRight />
                </Button>
            </div>
        </>
    );
}
