import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import { SidebarInset, SidebarProvider } from 'inflow/components/ui/sidebar';
import { SiteHeader } from 'inflow/components/site-header';
import { AppSidebar } from 'inflow/components/sidebar/app-sidebar';
import ArtifactRoot from 'inflow/components/artifact/artifact-root';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "InFlow - Your personal AI assiant",
    description: "Your personal AI assiant",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="[--header-height:calc(--spacing(14))]">
                    <SidebarProvider className="flex flex-col">
                        <SiteHeader />
                        <div className="flex flex-1">
                            <AppSidebar />
                            <SidebarInset>
                                <ArtifactRoot>
                                    {children}
                                </ArtifactRoot>
                            </SidebarInset>
                        </div>
                    </SidebarProvider>
                </div>
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
