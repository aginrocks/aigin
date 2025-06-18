'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AtomsBindProvider } from '@lib/providers/AtomsBind';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AtomsBindProvider>
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full h-screen relative">
                    <div className="absolute left-3 top-3 z-10">
                        <SidebarTrigger hideOnOpen />
                    </div>
                    {children}
                </div>
            </SidebarProvider>
        </AtomsBindProvider>
    );
}
