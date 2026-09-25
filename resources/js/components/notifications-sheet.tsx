import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { DashboardInvitation } from '@/types';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    Bell,
    CheckCheck,
    Clock,
    FileCheck2,
    Mail,
} from 'lucide-react';
import * as React from 'react';

type NotificationsSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pendingInvitations?: DashboardInvitation[];
};

type NotificationItem = {
    id: string;
    type: 'approval' | 'risk' | 'invitation' | 'system';
    title: string;
    description: string;
    time: string;
    unread: boolean;
};

export function NotificationsSheet({
    open,
    onOpenChange,
    pendingInvitations = [],
}: NotificationsSheetProps) {
    const [items, setItems] = React.useState<NotificationItem[]>([
        {
            id: 'notif-1',
            type: 'approval',
            title: 'Client Approval Requested',
            description:
                'Acme Corp Brand Campaign Reel v2 is awaiting client sign-off.',
            time: '12m ago',
            unread: true,
        },
        {
            id: 'notif-2',
            type: 'risk',
            title: 'Delivery At Risk: Video Editing',
            description:
                'Remaining hours exceed available designer capacity by 3.5h for Friday.',
            time: '45m ago',
            unread: true,
        },
        {
            id: 'notif-3',
            type: 'system',
            title: 'Weekly Profitability Report Ready',
            description:
                'August performance metrics and billable utilization have been calculated.',
            time: '2h ago',
            unread: false,
        },
    ]);

    const markAllRead = () => {
        setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
    };

    const unreadCount =
        items.filter((i) => i.unread).length + pendingInvitations.length;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 border-l border-neutral-200 p-0 sm:max-w-md dark:border-neutral-800"
            >
                <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                            <Bell className="size-4" />
                        </div>
                        <div>
                            <SheetTitle className="text-sm font-semibold">
                                Notifications
                            </SheetTitle>
                            <SheetDescription className="text-xs text-neutral-500">
                                {unreadCount > 0
                                    ? `${unreadCount} unread items require attention`
                                    : 'All caught up'}
                            </SheetDescription>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={markAllRead}
                            className="h-7 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                            <CheckCheck className="mr-1 size-3.5" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {/* Organization Invitations if any */}
                    {pendingInvitations.length > 0 && (
                        <div className="mb-4 space-y-2">
                            <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                                Organization Invitations
                            </div>
                            {pendingInvitations.map((inv) => (
                                <div
                                    key={inv.code}
                                    className="space-y-2 rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 text-xs dark:border-indigo-800 dark:bg-indigo-950/20"
                                >
                                    <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                                        <Mail className="size-4 text-indigo-600 dark:text-indigo-400" />
                                        <span>
                                            Invitation to{' '}
                                            {inv.organization.name}
                                        </span>
                                    </div>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        {inv.inviterName} invited you to join
                                        their organization workspace.
                                    </p>
                                    <div className="flex items-center gap-2 pt-1">
                                        <Link
                                            href={`/invitations/${inv.code}/accept`}
                                            method="post"
                                            as="button"
                                            className="rounded bg-indigo-600 px-2.5 py-1 font-medium text-white transition-colors hover:bg-indigo-700"
                                        >
                                            Accept
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Operational alerts */}
                    <div className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
                        Operational Activity
                    </div>

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                'space-y-1.5 rounded-lg border p-3 text-xs transition-colors',
                                item.unread
                                    ? 'border-neutral-200 bg-white shadow-xs dark:border-neutral-700 dark:bg-neutral-900'
                                    : 'border-transparent bg-neutral-50/70 text-neutral-600 dark:bg-neutral-900/40 dark:text-neutral-400',
                            )}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
                                    {item.type === 'approval' && (
                                        <FileCheck2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                                    )}
                                    {item.type === 'risk' && (
                                        <AlertCircle className="size-3.5 text-amber-600 dark:text-amber-400" />
                                    )}
                                    {item.type === 'system' && (
                                        <Clock className="size-3.5 text-neutral-500" />
                                    )}
                                    <span>{item.title}</span>
                                </div>
                                <span className="shrink-0 font-mono text-[10px] text-neutral-400">
                                    {item.time}
                                </span>
                            </div>
                            <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
