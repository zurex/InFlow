import { ChevronRight, History as HistoryIcon, Menu } from 'lucide-react'
import { 
    SidebarMenu, 
    SidebarMenuAction, 
    SidebarMenuButton, 
    SidebarMenuItem, 
    SidebarMenuSub, 
    SidebarMenuSubItem 
} from 'inflow/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'inflow/components/ui/collapsible';
import { HistoryList } from '../history-list';

export function HistoryMenu() {
    return (
        <SidebarMenu>
            <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip={"History"}>
                        <HistoryIcon />
                        <span>{"History"}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem />
                            <HistoryList />
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        </SidebarMenu>

    )
}