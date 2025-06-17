import { Button } from '@/components/ui/button';
import { IconChevronDown } from '@tabler/icons-react';
import { AppRouter } from '../../../../server/src';
import { inferProcedureOutput } from '@trpc/server';

type ModelSelectorProps = {
    models?: inferProcedureOutput<AppRouter['models']['get']>;
    selectedModel: string;
};

export default function ModelSelector({ selectedModel }: ModelSelectorProps) {
    return (
        <Button size="sm" variant="ghost" type="button">
            <span>{selectedModel}</span>
            <IconChevronDown />
        </Button>
    );
}
