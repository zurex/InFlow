import { DataStreamProvider } from 'inflow/components/data-stream/data-stream-provider';
import { AppSidebar } from 'inflow/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from 'inflow/components/ui/sidebar';
import { cookies } from 'next/headers';

export default async function Layout({ children }: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

    return (
        <DataStreamProvider>
            <SidebarProvider defaultOpen={!isCollapsed}>
                <AppSidebar />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </DataStreamProvider>
    );
}