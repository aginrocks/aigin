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
import { FormControl, FormField } from '../ui/form';
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
    icon?: ThemedIconProps;
    children?: ReactNode;
    formControl?: Control;
    name: string;
} & (
    | {
          type: 'select';
          options: SettingOption[];
          onValueChange?: (value: SettingOption['value']) => void;
          defaultValue?: SettingOption['value'];
          value?: SettingOption['value'];
          props?: React.ComponentProps<typeof Select>;
      }
    | {
          type: 'switch' | 'custom';
          options?: never;
          onValueChange?: (value: boolean) => void;
          defaultValue?: boolean;
          props?: React.ComponentProps<typeof Switch>;
          value?: boolean;
      }
    | {
          type: 'text';
          options?: never;
          onValueChange?: (value: string) => void;
          defaultValue?: string;
          props?: React.ComponentProps<typeof Input>;
          value?: string;
      }
);

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
const inputContainerVariants = cva('', {
    variants: {
        text: {
            true: 'w-full',
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
    onValueChange,
    defaultValue,
    props,
    name,
    value,
    formControl,
}: SettingProps) {
    const [inputValue, setInputValue] = useState('');

    return (
        <FormField
            control={formControl}
            name={name}
            render={({ field }) => (
                <div
                    className={cn(
                        'p-3 pl-3.5 rounded-md bg-secondary/50 backdrop-blur-sm flex flex-col gap-2',
                        settingVariants({ position })
                    )}
                >
                    <div className={settingContainerVariants({ text: type === 'text' })}>
                        <div className="flex items-center gap-3">
                            {icon && <ThemedIcon {...icon} />}
                            <div className="flex flex-col gap-0.5">
                                <div className="font-semibold text-sm px-1">{title}</div>
                                {description && type !== 'text' && (
                                    <div className="text-xs text-muted-foreground px-1">
                                        {description}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={inputContainerVariants({ text: type === 'text' })}>
                            {type === 'select' && (
                                <Select
                                    onValueChange={
                                        formControl
                                            ? field.onChange
                                            : (value) => onValueChange?.(value)
                                    }
                                    defaultValue={defaultValue}
                                    value={formControl ? field.value : value}
                                    {...props}
                                >
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
                            {type === 'switch' && (
                                <Switch
                                    checked={formControl ? field.value : value}
                                    defaultChecked={defaultValue}
                                    onCheckedChange={
                                        formControl
                                            ? field.onChange
                                            : (value) => onValueChange?.(value)
                                    }
                                    {...props}
                                />
                            )}
                            {type === 'text' && (
                                <Input
                                    className="w-full"
                                    type="text"
                                    onChange={
                                        value
                                            ? (value) => {
                                                  onValueChange?.(value.currentTarget.value);
                                                  setInputValue(value.currentTarget.value);
                                              }
                                            : (value) => {
                                                  field.onChange(value.currentTarget.value);
                                                  setInputValue(value.currentTarget.value);
                                              }
                                    }
                                    // defaultValue={value ? defaultValue : ''}
                                    value={value ? value : field.value || ''}
                                />
                            )}
                            {rightSection}
                        </div>
                    </div>
                    {children}
                </div>
            )}
        />
    );
}
