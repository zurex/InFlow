'use client';

import { useRouter } from 'next/navigation';
import { useSidebar } from '../ui/sidebar';
import { useWindowSize } from 'usehooks-ts';
import { SidebarToggle } from '../sidebar/sidebar-toggle';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';
import { PlusIcon } from '../icons';

export function ThreadHeader() {
    const router = useRouter();
    const { open } = useSidebar();

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
                                router.push('/');
                                router.refresh();
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