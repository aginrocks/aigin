import {
    Icon,
    IconAdjustmentsAlt,
    IconBolt,
    IconBrain,
    IconEye,
    IconFile,
    IconPhoto,
    IconTool,
    IconWorld,
} from '@tabler/icons-react';
import { ModelCapability } from '../../../../server/src/models/model';
import { Outputs } from '@lib/trpc';
import { cva, VariantProps } from 'class-variance-authority';

interface capabilityOptions {
    name: ModelCapability;
    label: string;
    color: VariantProps<typeof CapabilityTileVariants>['color'];
    icon: Icon;
}

export const capabilities: capabilityOptions[] = [
    {
        color: 'cyan',
        label: 'Vision',
        name: 'vision',
        icon: IconEye,
    },
    {
        color: 'blue',
        label: 'Search',
        name: 'search',
        icon: IconWorld,
    },
    {
        color: 'amber',
        label: 'Fast',
        name: 'fast',
        icon: IconBolt,
    },
    {
        color: 'amber',
        label: 'Fast',
        name: 'fast',
        icon: IconBolt,
    },
    {
        color: 'purple',
        label: 'File',
        name: 'file',
        icon: IconFile,
    },
    {
        color: 'fuchsia',
        label: 'Reasoning',
        name: 'reasoning',
        icon: IconBrain,
    },
    {
        color: 'red',
        label: 'Effort control',
        name: 'effort-control',
        icon: IconAdjustmentsAlt,
    },
    {
        color: 'green',
        label: 'Image generation',
        name: 'image-generation',
        icon: IconPhoto,
    },
    {
        color: 'yellow',
        label: 'Tools',
        name: 'tools',
        icon: IconTool,
    },
];

type CapabilitiesProps = {
    modelCapabilities: Outputs['models']['get'][0]['capabilities'];
};

function Capabilities({ modelCapabilities }: CapabilitiesProps) {
    return (
        <div className="flex gap-1 align-end">
            {modelCapabilities.map((c) => {
                const cap = capabilities.find((f) => f.name == c);
                if (cap) return <CapabilityTile key={c} capability={cap} />;
            })}
        </div>
    );
}

type CapabilityTileProps = {
    capability: capabilityOptions;
};

const CapabilityTileVariants = cva('p-1 backdrop-blur-md border rounded-lg', {
    variants: {
        color: {
            yellow: 'bg-yellow-600/20 text-yellow-400',
            purple: 'bg-purple-600/20 text-purple-400',
            amber: 'bg-amber-600/20 text-amber-400',
            cyan: 'bg-cyan-600/20 text-cyan-400',
            blue: 'bg-blue-600/20 text-blue-400',
            red: 'bg-red-600/20 text-red-400',
            fuchsia: 'bg-fuchsia-600/20 text-fuchsia-400',
            green: 'bg-green-600/20 text-green-400',
        },
    },
});

function CapabilityTile({ capability }: CapabilityTileProps) {
    return (
        <div className={CapabilityTileVariants({ color: capability.color })}>
            <capability.icon />
        </div>
    );
}

export { Capabilities };
