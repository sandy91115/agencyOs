import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { OrganizationSwitcher } from '@/components/organization-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
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
    PieChart,
    Search,
    Settings,
    Sparkles,
    Users,
} from 'lucide-react';

type AppSidebarProps = {
    onOpenSearch?: () => void;
    onOpenAi?: () => void;
    onOpenNotifications?: () => void;
    onOpenHelp?: () => void;
    unreadNotificationsCount?: number;
};

export function AppSidebar({
    onOpenSearch,
    onOpenAi,
    onOpenNotifications,
    onOpenHelp,
    unreadNotificationsCount = 0,
}: AppSidebarProps) {
    const page = usePage();
    const { isCurrentUrl } = useCurrentUrl();
    const currentOrganization = page.props.currentOrganization;
    const orgPrefix = currentOrganization ? `/${currentOrganization.slug}` : '';

    const mainNavItems: NavItem[] = [
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
            title: 'Clients',
            href: `${orgPrefix}/clients`,
            icon: Users,
        },
        {
            title: 'Projects',
            href: `${orgPrefix}/projects`,
            icon: FolderKanban,
        },
        {
            title: 'Calendar',
            href: `${orgPrefix}/calendar`,
            icon: Calendar,
        },
        {
            title: 'Capacity',
            href: `${orgPrefix}/capacity`,
            icon: BarChart3,
        },
        {
            title: 'Departments',
            href: `${orgPrefix}/departments`,
            icon: Building2,
        },
        {
            title: 'Reports',
            href: `${orgPrefix}/reports`,
            icon: PieChart,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`${orgPrefix}/dashboard`} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <OrganizationSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-sidebar-border/50 border-t pt-2">
                {/* Utility Dock */}
                <SidebarGroup className="px-2 py-0 group-data-[collapsible=icon]:p-0">
                    <SidebarGroupLabel className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                        Utilities
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Search */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={onOpenSearch}
                                    tooltip={{ children: 'Search (⌘K)' }}
                                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                                >
                                    <Search className="size-4" />
                                    <span>Search</span>
                                    <kbd className="ml-auto hidden rounded border border-neutral-200 bg-neutral-100 px-1 font-mono text-[9px] text-neutral-500 group-data-[collapsible=icon]:hidden sm:inline-block dark:border-neutral-700 dark:bg-neutral-800">
                                        ⌘K
                                    </kbd>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* AI Command Center */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={onOpenAi}
                                    tooltip={{ children: 'Ask Agency AI' }}
                                    className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                                >
                                    <Sparkles className="size-4" />
                                    <span className="font-medium">
                                        Ask Agency AI
                                    </span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Notifications */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={onOpenNotifications}
                                    tooltip={{ children: 'Notifications' }}
                                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                                >
                                    <div className="relative flex items-center">
                                        <Bell className="size-4" />
                                        {unreadNotificationsCount > 0 && (
                                            <span className="absolute -top-1 -right-1 size-1.5 rounded-full bg-red-500" />
                                        )}
                                    </div>
                                    <span>Notifications</span>
                                    {unreadNotificationsCount > 0 && (
                                        <span className="py-0.2 ml-auto rounded-full bg-red-100 px-1.5 text-[10px] font-semibold text-red-600 group-data-[collapsible=icon]:hidden dark:bg-red-950 dark:text-red-400">
                                            {unreadNotificationsCount}
                                        </span>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Help */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={onOpenHelp}
                                    tooltip={{ children: 'Help & Shortcuts' }}
                                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                                >
                                    <HelpCircle className="size-4" />
                                    <span>Help</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Settings */}
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        isCurrentUrl('/settings/profile') ||
                                        isCurrentUrl('/settings/organizations')
                                    }
                                    tooltip={{ children: 'Settings' }}
                                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                                >
                                    <Link href="/settings/profile" prefetch>
                                        <Settings className="size-4" />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* User Profile */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
