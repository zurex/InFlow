import { useSidebar } from '@inflow/components/ui/sidebar';
import { useWindowSize } from 'usehooks-ts';
import { Tooltip, TooltipContent, TooltipTrigger } from '@inflow/components/ui/tooltip';
import { PlusIcon } from '../icons';
import { Button } from '../ui/button';
import { SidebarToggle } from '../sidebar/sidebar-toggle';


export function ThreadHeader() {
    //const { open } = useSidebar();
    const open = true;

    const { width: windowWidth } = useWindowSize();

    return (
        <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
            <SidebarToggle />

            {(!open || windowWidth < 768) && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
                            onClick={() => {
                               
                            }}
                        >
                            <PlusIcon />
                            <span className="md:sr-only">New Chat</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>New Chat</TooltipContent>
                </Tooltip>
            )}
        </header>
    );
}