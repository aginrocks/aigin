import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TRPCClientProvider } from '@/lib/providers/query-client';
import { ThemeProvider } from '@/components/theme-provider';
import { ModalsManagerProvider } from '@lib/modals/ModalsManager';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Aigin',
    description: 'Ai chats made simple',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <TRPCClientProvider>
                        <ReactQueryProvider>
                            <ModalsManagerProvider>{children}</ModalsManagerProvider>
                        </ReactQueryProvider>
                    </TRPCClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
