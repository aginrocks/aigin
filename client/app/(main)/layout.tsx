import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full h-screen relative">
                <div className="absolute left-3 top-3 z-10">
                    <SidebarTrigger hideOnOpen />
                </div>
                {children}
            </div>
        </SidebarProvider>
    );
}
