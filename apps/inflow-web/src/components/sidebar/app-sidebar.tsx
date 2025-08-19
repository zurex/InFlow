'use client';

import { useRouter } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarMenu, useSidebar } from 'inflow/components/ui/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from 'inflow/components/ui/tooltip';
import { Button } from 'inflow/components/ui/button';
import { PlusIcon } from 'inflow/components/icons';

export function AppSidebar() {
    const router = useRouter();
    const { setOpenMobile } = useSidebar();

    return (
        <Sidebar className="group-data-[side=left]:border-r-0">
            <SidebarHeader>
                <SidebarMenu>
                    <div className="flex flex-row justify-between items-center">
                        <Link
                            href="/"
                            onClick={() => {
                                setOpenMobile(false);
                            }}
                            className="flex flex-row gap-3 items-center"
                        >
                            <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                                Mote
                            </span>
                        </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    type="button"
                                    className="p-2 h-fit"
                                    onClick={() => {
                                        setOpenMobile(false);
                                        router.push('/');
                                        router.refresh();
                                    }}
                                >
                                    <PlusIcon />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent align="end">New Chat</TooltipContent>
                        </Tooltip>
                    </div>
                </SidebarMenu>
            </SidebarHeader>
        </Sidebar>
    );
}