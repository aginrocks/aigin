import { Icon } from '@tabler/icons-react';

export type OnboardingHeaderProps = {
    title: string;
    description?: string;
    icon?: Icon;
};

export function OnboardingHeader({ title, description, icon: Icon }: OnboardingHeaderProps) {
    return (
        <div className="">
            {Icon && <Icon className="size-10 mb-4" />}
            <div className="text-2xl font-semibold">{title}</div>
            {description && <div className="text-muted-foreground mt-1">{description}</div>}
        </div>
    );
}
