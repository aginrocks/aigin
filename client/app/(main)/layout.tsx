import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-screen h-screen">
                <SidebarTrigger hideOnOpen />
                {children}
            </div>
        </SidebarProvider>
    );
}
