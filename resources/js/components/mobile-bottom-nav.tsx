import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    Building2,
    Calendar,
    CheckSquare,
    FolderKanban,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    Menu,
    PieChart,
    Search,
    Settings,
    Sparkles,
    Users,
} from 'lucide-react';
import * as React from 'react';

type MobileBottomNavProps = {
    onOpenSearch?: () => void;
    onOpenAi?: () => void;
    onOpenNotifications?: () => void;
    onOpenHelp?: () => void;
    unreadNotificationsCount?: number;
};

export function MobileBottomNav({
    onOpenSearch,
    onOpenAi,
    onOpenNotifications,
    onOpenHelp,
    unreadNotificationsCount = 0,
}: MobileBottomNavProps) {
    const page = usePage();
    const { isCurrentUrl } = useCurrentUrl();
    const [moreOpen, setMoreOpen] = React.useState(false);

    const orgSlug = page.props.currentOrganization?.slug || '';
    const orgPrefix = orgSlug ? `/${orgSlug}` : '';

    const bottomTabs = [
        {
            title: 'Home',
            href: `${orgPrefix}/dashboard`,
            icon: LayoutDashboard,
        },
        {
            title: 'My Work',
            href: `${orgPrefix}/my-work`,
            icon: CheckSquare,
        },
        {
            title: 'Calendar',
            href: `${orgPrefix}/calendar`,
            icon: Calendar,
        },
    ];

    const moreNavItems = [
        {
            title: 'Clients',
            href: `${orgPrefix}/clients`,
            icon: Users,
            description: 'Client roster and health status',
        },
        {
            title: 'Projects',
            href: `${orgPrefix}/projects`,
            icon: FolderKanban,
            description: 'Active deliverables and campaigns',
        },
        {
            title: 'Capacity Planner',
            href: `${orgPrefix}/capacity`,
            icon: BarChart3,
            description: 'Workload and hours balancing',
        },
        {
            title: 'Departments',
            href: `${orgPrefix}/departments`,
            icon: Building2,
            description: 'Departmental utilization',
        },
        {
            title: 'Reports',
            href: `${orgPrefix}/reports`,
            icon: PieChart,
            description: 'Margin and delivery metrics',
        },
        {
            title: 'Settings',
            href: '/settings/profile',
            icon: Settings,
            description: 'Organization and profile settings',
        },
    ];

    return (
        <>
            {/* Mobile Bottom Navigation Bar */}
            <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-900/95">
                <div className="grid h-16 grid-cols-5">
                    {bottomTabs.map((tab) => {
                        const active = isCurrentUrl(tab.href);
                        const Icon = tab.icon;

                        return (
                            <Link
                                key={tab.title}
                                href={tab.href}
                                prefetch
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                                    active
                                        ? 'text-indigo-600 dark:text-indigo-400'
                                        : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'size-5',
                                        active && 'stroke-[2.5]',
                                    )}
                                />
                                <span>{tab.title}</span>
                            </Link>
                        );
                    })}

                    {/* Notifications tab */}
                    <button
                        type="button"
                        onClick={onOpenNotifications}
                        className="relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                        <div className="relative">
                            <Bell className="size-5" />
                            {unreadNotificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-red-500" />
                            )}
                        </div>
                        <span>Alerts</span>
                    </button>

                    {/* More tab */}
                    <button
                        type="button"
                        onClick={() => setMoreOpen(true)}
                        className="flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    >
                        <Menu className="size-5" />
                        <span>More</span>
                    </button>
                </div>
            </nav>

            {/* Slide-up "More" Menu Sheet */}
            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                <SheetContent
                    side="bottom"
                    className="flex max-h-[85vh] flex-col rounded-t-2xl p-0"
                >
                    <div className="border-b border-neutral-200 p-4 dark:border-neutral-800">
                        <SheetTitle className="text-base font-semibold">
                            More Workspaces & Tools
                        </SheetTitle>
                        <SheetDescription className="text-xs text-neutral-500">
                            Quick access to workspaces and utilities
                        </SheetDescription>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-b border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                        <button
                            type="button"
                            onClick={() => {
                                setMoreOpen(false);
                                onOpenSearch?.();
                            }}
                            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2.5 text-xs font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                        >
                            <Search className="size-4 text-neutral-500" />
                            <span>Search (⌘K)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMoreOpen(false);
                                onOpenAi?.();
                            }}
                            className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/60 p-2.5 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                        >
                            <Sparkles className="size-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Ask Agency AI</span>
                        </button>
                    </div>

                    <div className="flex-1 space-y-1 overflow-y-auto p-3">
                        {moreNavItems.map((item) => {
                            const Icon = item.icon;
                            const active = isCurrentUrl(item.href);

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    onClick={() => setMoreOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg p-2.5 text-xs transition-colors',
                                        active
                                            ? 'bg-neutral-100 font-semibold text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                                            : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50',
                                    )}
                                >
                                    <div className="flex size-7 items-center justify-center rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                        <Icon className="size-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {item.title}
                                        </div>
                                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                            {item.description}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                        <button
                            type="button"
                            onClick={() => {
                                setMoreOpen(false);
                                onOpenHelp?.();
                            }}
                            className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50"
                        >
                            <div className="flex size-7 items-center justify-center rounded-md bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                <HelpCircle className="size-4" />
                            </div>
                            <div>
                                <div className="font-medium">
                                    Help & Documentation
                                </div>
                                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                    Keyboard shortcuts and operating manual
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="border-t border-neutral-200 p-3 dark:border-neutral-800">
                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                            <LogOut className="size-4" />
                            <span>Log Out</span>
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
