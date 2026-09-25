import { Breadcrumbs } from '@/components/breadcrumbs';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Bell, Search, Sparkles } from 'lucide-react';

type AppSidebarHeaderProps = {
    breadcrumbs?: BreadcrumbItemType[];
    onOpenSearch?: () => void;
    onOpenAi?: () => void;
    onOpenNotifications?: () => void;
    unreadNotificationsCount?: number;
};

export function AppSidebarHeader({
    breadcrumbs = [],
    onOpenSearch,
    onOpenAi,
    onOpenNotifications,
    unreadNotificationsCount = 0,
}: AppSidebarHeaderProps) {
    return (
        <header className="border-sidebar-border/50 flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
            {/* Left Area: Sidebar Trigger + Breadcrumbs */}
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100" />
                <div className="hidden items-center gap-2 sm:flex">
                    <OrganizationSwitcher inHeader />
                    <span className="text-neutral-300 dark:text-neutral-700">
                        /
                    </span>
                </div>
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Right Area: Global Actions */}
            <div className="flex shrink-0 items-center gap-2">
                {/* Search Quick Action */}
                <button
                    type="button"
                    onClick={onOpenSearch}
                    className="hidden items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs text-neutral-500 transition-colors hover:border-neutral-300 sm:flex dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700"
                >
                    <Search className="size-3.5 text-neutral-400" />
                    <span>Search...</span>
                    <kbd className="ml-1 rounded border border-neutral-200 bg-white px-1 font-mono text-[10px] text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
                        ⌘K
                    </kbd>
                </button>

                {/* Ask AI Trigger */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onOpenAi}
                    className="h-8 gap-1.5 border-indigo-200 text-xs text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
                >
                    <Sparkles className="size-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="hidden md:inline">Ask AI</span>
                </Button>

                {/* Notifications Bell */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenNotifications}
                    className="relative size-8 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    aria-label="Notifications"
                >
                    <Bell className="size-4" />
                    {unreadNotificationsCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900" />
                    )}
                </Button>
            </div>
        </header>
    );
}
