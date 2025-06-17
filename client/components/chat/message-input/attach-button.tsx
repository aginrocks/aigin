import { Button } from '@components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { IconCamera, IconFilePlus, IconPaperclip } from '@tabler/icons-react';

export function AttachButton() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="md-icon" className="dark:hover:bg-secondary-hover-2">
                    <IconPaperclip />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <IconFilePlus />
                    Upload a File
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <IconCamera />
                    Take a screenshot
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
