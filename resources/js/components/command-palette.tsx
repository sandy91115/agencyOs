import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    Calendar,
    CheckSquare,
    FolderKanban,
    LayoutDashboard,
    Moon,
    PieChart,
    Search,
    Settings,
    Sparkles,
    Sun,
    Users,
    X,
} from 'lucide-react';
import * as React from 'react';

type CommandPaletteProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenAi?: () => void;
};

type ActionItem = {
    id: string;
    title: string;
    category: 'Navigation' | 'Actions' | 'Preferences';
    icon: React.ComponentType<{ className?: string }>;
    shortcut?: string;
    description?: string;
    perform: () => void;
};

export function CommandPalette({
    open,
    onOpenChange,
    onOpenAi,
}: CommandPaletteProps) {
    const page = usePage();
    const { appearance, updateAppearance } = useAppearance();
    const [query, setQuery] = React.useState('');
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const orgSlug = page.props.currentOrganization?.slug || '';

    const actions: ActionItem[] = React.useMemo(() => {
        const orgPrefix = orgSlug ? `/${orgSlug}` : '';

        return [
            {
                id: 'nav-dashboard',
                title: 'Home / Dashboard',
                category: 'Navigation',
                icon: LayoutDashboard,
                description:
                    'Overview of delivery risks, utilization, and margin',
                perform: () => router.visit(`${orgPrefix}/dashboard`),
            },
            {
                id: 'nav-work',
                title: 'My Work',
                category: 'Navigation',
                icon: CheckSquare,
                description:
                    'Personal task queue, focus mode, and assigned work',
                perform: () => router.visit(`${orgPrefix}/my-work`),
            },
            {
                id: 'nav-clients',
                title: 'Clients',
                category: 'Navigation',
                icon: Users,
                description:
                    'Client roster, health status, and active retainers',
                perform: () => router.visit(`${orgPrefix}/clients`),
            },
            {
                id: 'nav-projects',
                title: 'Projects',
                category: 'Navigation',
                icon: FolderKanban,
                description:
                    'Client projects, campaign deliverables, and milestones',
                perform: () => router.visit(`${orgPrefix}/projects`),
            },
            {
                id: 'nav-calendar',
                title: 'Calendar',
                category: 'Navigation',
                icon: Calendar,
                description:
                    'Content, social, and production delivery calendar',
                perform: () => router.visit(`${orgPrefix}/calendar`),
            },
            {
                id: 'nav-capacity',
                title: 'Capacity Planner',
                category: 'Navigation',
                icon: BarChart3,
                description:
                    'Hours-based team availability and workload balance',
                perform: () => router.visit(`${orgPrefix}/capacity`),
            },
            {
                id: 'nav-departments',
                title: 'Departments',
                category: 'Navigation',
                icon: Building2,
                description: 'Creative, video, dev, and marketing departments',
                perform: () => router.visit(`${orgPrefix}/departments`),
            },
            {
                id: 'nav-reports',
                title: 'Reports & Profitability',
                category: 'Navigation',
                icon: PieChart,
                description:
                    'Delivery velocity, billable hours, and margin intelligence',
                perform: () => router.visit(`${orgPrefix}/reports`),
            },
            {
                id: 'action-ai',
                title: 'Ask Agency AI',
                category: 'Actions',
                icon: Sparkles,
                shortcut: '⌘J',
                description:
                    'Analyze delivery risks or propose executable schedules',
                perform: () => {
                    onOpenChange(false);
                    onOpenAi?.();
                },
            },
            {
                id: 'action-settings',
                title: 'Settings',
                category: 'Actions',
                icon: Settings,
                shortcut: '⌘,',
                description:
                    'Organization settings, profile, and security preferences',
                perform: () => router.visit('/settings/profile'),
            },
            {
                id: 'theme-toggle',
                title:
                    appearance === 'dark'
                        ? 'Switch to Light Mode'
                        : 'Switch to Dark Mode',
                category: 'Preferences',
                icon: appearance === 'dark' ? Sun : Moon,
                description: 'Adjust visual appearance theme',
                perform: () =>
                    updateAppearance(appearance === 'dark' ? 'light' : 'dark'),
            },
        ];
    }, [orgSlug, onOpenChange, onOpenAi, appearance, updateAppearance]);

    const filtered = React.useMemo(() => {
        if (!query.trim()) return actions;
        const q = query.toLowerCase();
        return actions.filter(
            (item) =>
                item.title.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q),
        );
    }, [actions, query]);

    React.useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onOpenChange(!open);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onOpenChange]);

    const executeItem = (item: ActionItem) => {
        onOpenChange(false);
        item.perform();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(
                (prev) => (prev + 1) % Math.max(1, filtered.length),
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(
                (prev) =>
                    (prev - 1 + filtered.length) % Math.max(1, filtered.length),
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[selectedIndex]) {
                executeItem(filtered[selectedIndex]);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl gap-0 overflow-hidden border-neutral-200 p-0 shadow-2xl dark:border-neutral-800">
                <DialogHeader className="sr-only">
                    <DialogTitle>Quick Search and Command Palette</DialogTitle>
                    <DialogDescription>
                        Navigate AgencyOS or execute quick actions
                    </DialogDescription>
                </DialogHeader>

                <div className="flex items-center border-b border-neutral-200 px-3.5 py-2.5 dark:border-neutral-800">
                    <Search className="mr-2.5 size-4 shrink-0 text-neutral-400" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search pages, commands, clients, or tasks..."
                        className="h-8 border-0 bg-transparent p-0 text-sm placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoFocus
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                    <kbd className="ml-2 hidden items-center rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 sm:inline-flex dark:border-neutral-700 dark:bg-neutral-800">
                        ESC
                    </kbd>
                </div>

                <div className="max-h-[360px] overflow-y-auto p-2">
                    {filtered.length === 0 ? (
                        <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                            No matching commands found for &ldquo;{query}&rdquo;
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {filtered.map((item, index) => {
                                const isSelected = index === selectedIndex;
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => executeItem(item)}
                                        onMouseEnter={() =>
                                            setSelectedIndex(index)
                                        }
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                                            isSelected
                                                ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                                                : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/60',
                                        )}
                                    >
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <div
                                                className={cn(
                                                    'flex size-7 shrink-0 items-center justify-center rounded-md border text-neutral-600 dark:text-neutral-300',
                                                    isSelected
                                                        ? 'border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900'
                                                        : 'border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/50',
                                                )}
                                            >
                                                <Icon className="size-4" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="truncate font-medium">
                                                    {item.title}
                                                </div>
                                                {item.description && (
                                                    <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                                        {item.description}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ml-3 flex shrink-0 items-center gap-2">
                                            <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
                                                {item.category}
                                            </span>
                                            {item.shortcut && (
                                                <kbd className="hidden items-center rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 sm:inline-flex dark:border-neutral-700 dark:bg-neutral-800">
                                                    {item.shortcut}
                                                </kbd>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-400">
                    <div className="flex items-center gap-3">
                        <span>
                            <kbd className="font-mono">↑↓</kbd> Navigate
                        </span>
                        <span>
                            <kbd className="font-mono">↵</kbd> Select
                        </span>
                    </div>
                    <span>AgencyOS Command</span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
