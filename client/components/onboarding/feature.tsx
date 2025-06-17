import { Icon } from '@tabler/icons-react';

export type FeatureProps = {
    title: string;
    description?: string;
    icon?: Icon;
};

export function Feature({ title, description, icon: Icon }: FeatureProps) {
    return (
        <div className="border rounded-lg p-4 bg-popover/60 backdrop-blur-sm">
            {Icon && <Icon className="size-6 mb-3 mt-0.5" />}
            <div className="font-semibold">{title}</div>
            {description && (
                <div className="text-sm text-muted-foreground mt-0.5">{description}</div>
            )}
        </div>
    );
}
