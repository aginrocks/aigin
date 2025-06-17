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
import { ReactNode, useState } from 'react';
import { FormField } from '../ui/form';
import { Control } from 'react-hook-form';
import { Input } from '../ui/input';

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
    // icon?: ThemedIconProps;
    children?: ReactNode;
    // name: string;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    textValue?: string;
    onTextChange?: (value: string) => void;
    placeholder?: string;
    switchDisabled?: boolean;
};

const settingVariants = cva('rounded-md', {
    variants: {
        position: {
            start: 'rounded-b-none',
            middle: 'rounded-none',
            end: 'rounded-t-none',
        },
    },
});

const settingContainerVariants = cva('flex justify-between items-center', {
    variants: {
        text: {
            true: 'gap-2 flex-col items-start',
        },
    },
});

export function ProviderSetting({
    title,
    description,
    position,
    rightSection,
    children,
    switchValue,
    onSwitchChange,
    textValue,
    onTextChange,
    placeholder,
    switchDisabled,
}: SettingProps) {
    const type = 'text';

    return (
        <div
            className={cn(
                'p-3 pl-3.5 rounded-md bg-secondary/50 backdrop-blur-sm flex flex-col gap-2',
                settingVariants({ position })
            )}
        >
            <div className={settingContainerVariants({ text: type === 'text' })}>
                <div className="flex w-full items-center gap-5">
                    {/* {icon && <ThemedIcon {...icon} />} */}
                    <div className="w-xs flex flex-col gap-0.5">
                        <div className="font-semibold text-sm px-1">{title}</div>
                        {description && type !== 'text' && (
                            <div className="text-xs text-muted-foreground px-1">{description}</div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 w-full">
                        <Input
                            placeholder={placeholder}
                            className="w-full flex-1"
                            type="text"
                            onChange={(value) => {
                                onTextChange?.(value.currentTarget.value);
                            }}
                            defaultValue={textValue}
                        />
                        <Switch
                            disabled={switchDisabled}
                            defaultChecked={switchValue}
                            onCheckedChange={(value) => onSwitchChange?.(value)}
                        />
                        {rightSection}
                    </div>
                </div>
            </div>
            {children}
        </div>
    );
}
