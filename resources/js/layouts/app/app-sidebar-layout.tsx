import { AgencyAiDrawer } from '@/components/agency-ai-drawer';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { CommandPalette } from '@/components/command-palette';
import { HelpModal } from '@/components/help-modal';
import { MobileBottomNav } from '@/components/mobile-bottom-nav';
import { NotificationsSheet } from '@/components/notifications-sheet';
import type { AppLayoutProps } from '@/types';
import * as React from 'react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const [searchOpen, setSearchOpen] = React.useState(false);
    const [aiOpen, setAiOpen] = React.useState(false);
    const [notificationsOpen, setNotificationsOpen] = React.useState(false);
    const [helpOpen, setHelpOpen] = React.useState(false);

    // Default sample unread count (e.g. 2 alerts)
    const unreadCount = 2;

    return (
        <AppShell variant="sidebar">
            <AppSidebar
                onOpenSearch={() => setSearchOpen(true)}
                onOpenAi={() => setAiOpen(true)}
                onOpenNotifications={() => setNotificationsOpen(true)}
                onOpenHelp={() => setHelpOpen(true)}
                unreadNotificationsCount={unreadCount}
            />

            <AppContent
                variant="sidebar"
                className="min-w-0 overflow-x-clip pb-20 md:pb-0"
            >
                <AppSidebarHeader
                    breadcrumbs={breadcrumbs}
                    onOpenSearch={() => setSearchOpen(true)}
                    onOpenAi={() => setAiOpen(true)}
                    onOpenNotifications={() => setNotificationsOpen(true)}
                    unreadNotificationsCount={unreadCount}
                />

                <main className="flex min-h-0 flex-1 flex-col">{children}</main>

                {/* Mobile Bottom Navigation (< md) */}
                <MobileBottomNav
                    onOpenSearch={() => setSearchOpen(true)}
                    onOpenAi={() => setAiOpen(true)}
                    onOpenNotifications={() => setNotificationsOpen(true)}
                    onOpenHelp={() => setHelpOpen(true)}
                    unreadNotificationsCount={unreadCount}
                />

                {/* Global Interactive Overlays */}
                <CommandPalette
                    open={searchOpen}
                    onOpenChange={setSearchOpen}
                    onOpenAi={() => setAiOpen(true)}
                />

                <AgencyAiDrawer open={aiOpen} onOpenChange={setAiOpen} />

                <NotificationsSheet
                    open={notificationsOpen}
                    onOpenChange={setNotificationsOpen}
                />

                <HelpModal open={helpOpen} onOpenChange={setHelpOpen} />
            </AppContent>
        </AppShell>
    );
}
