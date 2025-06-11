import React, { ReactNode } from 'react';
import { SettingProps } from './setting';

export type SettingsGroupProps = {
    title?: string;
    children?: ReactNode;
};

export function SettingsGroup({ title, children }: SettingsGroupProps) {
    const updatedChildren = React.Children.map(children, (child, i) => {
        if (React.isValidElement<SettingProps>(child)) {
            return React.cloneElement(child, {
                position:
                    React.Children.count(children) === 1
                        ? undefined
                        : i === 0
                          ? 'start'
                          : i === React.Children.count(children) - 1
                            ? 'end'
                            : 'middle',
            });
        }
        return child;
    });

    return (
        <div>
            {title && <div className="font-semibold text-sm mb-1.5">{title}</div>}
            <div className="flex flex-col gap-1">{updatedChildren}</div>
        </div>
    );
}
