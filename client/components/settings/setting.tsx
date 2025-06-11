import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select';
import { Switch } from '@components/ui/switch';
import { ThemedIcon, ThemedIconProps } from '@components/ui/themed-icon';
import { cn } from '@lib/utils';
import { cva } from 'class-variance-authority';
import { ReactNode } from 'react';

export type SettingPosition = 'start' | 'middle' | 'end';

export type SettingOption = {
    label: string;
    value: string;
};

export type SettingProps = {
    title: string;
    description?: string;
    position?: SettingPosition;
    rightSection?: ReactNode;
    icon?: ThemedIconProps;
    children?: ReactNode;
} & ({ type: 'select'; options: SettingOption[] } | { type: 'switch' | 'custom'; options?: never });

const settingVariants = cva('rounded-md', {
    variants: {
        position: {
            start: 'rounded-b-none',
            middle: 'rounded-none',
            end: 'rounded-t-none',
        },
    },
});

export function Setting({
    title,
    description,
    type,
    position,
    options,
    rightSection,
    icon,
    children,
}: SettingProps) {
    return (
        <div
            className={cn(
                'p-3 pl-3.5 rounded-md bg-secondary flex flex-col gap-2',
                settingVariants({ position })
            )}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {icon && <ThemedIcon {...icon} />}
                    <div className="flex flex-col gap-0.5">
                        <div className="font-semibold text-sm">{title}</div>
                        {description && (
                            <div className="text-xs text-muted-foreground">{description}</div>
                        )}
                    </div>
                </div>
                <div>
                    {type === 'select' && (
                        <Select>
                            <SelectTrigger className="w-[180px] rounded-sm">
                                <SelectValue placeholder={title} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {type === 'switch' && <Switch />}
                    {rightSection}
                </div>
            </div>
            {children}
        </div>
    );
}
