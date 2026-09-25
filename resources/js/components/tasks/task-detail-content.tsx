import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Clock,
    Eye,
    EyeOff,
    FileText,
    MessageSquare,
    Plus,
    Send,
    Shield,
    UserCheck,
    Users,
} from 'lucide-react';
import * as React from 'react';

export type TaskChecklistItem = {
    id: number;
    title: string;
    is_completed: boolean;
    completed_at: string | null;
    sort_order: number;
};

export type TaskCommentItem = {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    content: string;
    visibility: 'internal' | 'client';
    created_at: string;
};

export type TaskTimeLogItem = {
    id: number;
    user: {
        id: number;
        name: string;
    };
    hours: number;
    notes: string | null;
    logged_at: string;
};

export type TaskDetailData = {
    id: number;
    client_name: string;
    project_name: string;
    title: string;
    brief: string | null;
    priority: 'urgent' | 'high' | 'normal' | 'low';
    status: 'todo' | 'in_progress' | 'review' | 'blocked' | 'completed';
    start_date: string | null;
    due_date: string | null;
    estimate_hours: number;
    spent_hours: number;
    remaining_hours: number;
    is_client_visible: boolean;
    dependencies_summary: string | null;
    assigned_user?: {
        id: number;
        name: string;
        email: string;
    } | null;
    checklists?: TaskChecklistItem[];
    comments?: TaskCommentItem[];
    time_logs?: TaskTimeLogItem[];
};

type TaskDetailContentProps = {
    task: TaskDetailData;
    onTaskUpdated?: (updated: TaskDetailData) => void;
    compact?: boolean;
};

export function TaskDetailContent({
    task,
    onTaskUpdated,
    compact = false,
}: TaskDetailContentProps) {
    const page = usePage();
    const orgSlug = page.props.currentOrganization?.slug || '';
    const orgPrefix = orgSlug ? `/${orgSlug}` : '';

    const [currentTask, setCurrentTask] = React.useState<TaskDetailData>(task);
    const [newComment, setNewComment] = React.useState('');
    const [commentVisibility, setCommentVisibility] = React.useState<
        'internal' | 'client'
    >('internal');
    const [newChecklistTitle, setNewChecklistTitle] = React.useState('');
    const [logHours, setLogHours] = React.useState('1.0');
    const [logNotes, setLogNotes] = React.useState('');
    const [isLoggingTime, setIsLoggingTime] = React.useState(false);

    React.useEffect(() => {
        setCurrentTask(task);
    }, [task]);

    // Status transition handler
    const handleStatusChange = (newStatus: TaskDetailData['status']) => {
        router.patch(
            `${orgPrefix}/tasks/${currentTask.id}/status`,
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    const updated = { ...currentTask, status: newStatus };
                    setCurrentTask(updated);
                    onTaskUpdated?.(updated);
                },
            },
        );
    };

    // Toggle checklist
    const handleToggleChecklist = (item: TaskChecklistItem) => {
        router.post(
            `${orgPrefix}/tasks/${currentTask.id}/checklists/${item.id}/toggle`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    const updatedList = (currentTask.checklists || []).map(
                        (chk) =>
                            chk.id === item.id
                                ? { ...chk, is_completed: !chk.is_completed }
                                : chk,
                    );
                    const updated = { ...currentTask, checklists: updatedList };
                    setCurrentTask(updated);
                    onTaskUpdated?.(updated);
                },
            },
        );
    };

    // Add checklist
    const handleAddChecklist = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChecklistTitle.trim()) return;

        router.post(
            `${orgPrefix}/tasks/${currentTask.id}/checklists`,
            { title: newChecklistTitle },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewChecklistTitle('');
                },
            },
        );
    };

    // Log time
    const handleLogTime = (e: React.FormEvent) => {
        e.preventDefault();
        const hoursNum = parseFloat(logHours);
        if (isNaN(hoursNum) || hoursNum <= 0) return;

        setIsLoggingTime(true);
        router.post(
            `${orgPrefix}/tasks/${currentTask.id}/time-logs`,
            { hours: hoursNum, notes: logNotes },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsLoggingTime(false);
                    setLogNotes('');
                    const updated = {
                        ...currentTask,
                        spent_hours: currentTask.spent_hours + hoursNum,
                        remaining_hours: Math.max(
                            0,
                            currentTask.remaining_hours - hoursNum,
                        ),
                    };
                    setCurrentTask(updated);
                    onTaskUpdated?.(updated);
                },
                onError: () => setIsLoggingTime(false),
            },
        );
    };

    // Add comment
    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        router.post(
            `${orgPrefix}/tasks/${currentTask.id}/comments`,
            { content: newComment, visibility: commentVisibility },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewComment('');
                },
            },
        );
    };

    const statusOptions: Array<{
        id: TaskDetailData['status'];
        label: string;
        color: string;
    }> = [
        {
            id: 'todo',
            label: 'To Do',
            color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        },
        {
            id: 'in_progress',
            label: 'In Progress',
            color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
        },
        {
            id: 'review',
            label: 'In Review',
            color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
        },
        {
            id: 'blocked',
            label: 'Blocked',
            color: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
        },
        {
            id: 'completed',
            label: 'Completed',
            color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        },
    ];

    const percentUsed =
        currentTask.estimate_hours > 0
            ? Math.min(
                  100,
                  Math.round(
                      (currentTask.spent_hours / currentTask.estimate_hours) *
                          100,
                  ),
              )
            : 0;

    return (
        <div className="flex w-full flex-col gap-6">
            {/* Header / Client & Deliverable Identity */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {currentTask.client_name}
                        </span>
                        <span>/</span>
                        <span>{currentTask.project_name}</span>
                        <span>/</span>
                        <span className="font-mono">TASK-{currentTask.id}</span>
                    </div>
                    <h2 className="text-lg leading-snug font-bold text-neutral-900 dark:text-neutral-100">
                        {currentTask.title}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className={cn(
                            'text-[10px] font-semibold uppercase',
                            currentTask.priority === 'urgent' &&
                                'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400',
                            currentTask.priority === 'high' &&
                                'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400',
                            currentTask.priority === 'normal' &&
                                'border-neutral-200 bg-neutral-50 text-neutral-600 dark:bg-neutral-800',
                        )}
                    >
                        {currentTask.priority}
                    </Badge>
                    <Badge
                        variant="secondary"
                        className={cn(
                            'text-xs font-medium capitalize',
                            currentTask.status === 'completed' &&
                                'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
                            currentTask.status === 'in_progress' &&
                                'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
                            currentTask.status === 'blocked' &&
                                'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300',
                        )}
                    >
                        {currentTask.status.replace('_', ' ')}
                    </Badge>
                </div>
            </div>

            {/* 2-Column Desktop Grid Layout */}
            <div
                className={cn(
                    'grid gap-6',
                    compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3',
                )}
            >
                {/* Main Column (2 Cols): Brief, Checklist, Comments */}
                <div
                    className={cn('space-y-6', compact ? '' : 'lg:col-span-2')}
                >
                    {/* Brief & Requirements */}
                    <div className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                            <FileText className="size-3.5" />
                            Production Brief & Specifications
                        </div>
                        <p className="text-xs leading-relaxed whitespace-pre-line text-neutral-700 dark:text-neutral-300">
                            {currentTask.brief ||
                                'No detailed brief specified for this task.'}
                        </p>
                    </div>

                    {/* Production Checklist */}
                    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 font-semibold tracking-wider text-neutral-400 uppercase">
                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                Production Checklist (
                                {
                                    (currentTask.checklists || []).filter(
                                        (c) => c.is_completed,
                                    ).length
                                }
                                /{(currentTask.checklists || []).length})
                            </div>
                        </div>

                        <div className="space-y-2">
                            {(currentTask.checklists || []).length === 0 ? (
                                <p className="text-xs text-neutral-400 italic">
                                    No checklist items yet.
                                </p>
                            ) : (
                                (currentTask.checklists || []).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50 p-2 text-xs transition-colors dark:border-neutral-800 dark:bg-neutral-950/50"
                                    >
                                        <Checkbox
                                            checked={item.is_completed}
                                            onCheckedChange={() =>
                                                handleToggleChecklist(item)
                                            }
                                            id={`check-${item.id}`}
                                        />
                                        <label
                                            htmlFor={`check-${item.id}`}
                                            className={cn(
                                                'flex-1 cursor-pointer font-medium',
                                                item.is_completed
                                                    ? 'text-neutral-400 line-through dark:text-neutral-500'
                                                    : 'text-neutral-800 dark:text-neutral-200',
                                            )}
                                        >
                                            {item.title}
                                        </label>
                                    </div>
                                ))
                            )}

                            {/* Add checklist item form */}
                            <form
                                onSubmit={handleAddChecklist}
                                className="flex items-center gap-2 pt-1"
                            >
                                <Input
                                    value={newChecklistTitle}
                                    onChange={(e) =>
                                        setNewChecklistTitle(e.target.value)
                                    }
                                    placeholder="Add checklist step..."
                                    className="h-8 bg-transparent text-xs"
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    variant="outline"
                                    className="h-8 shrink-0 text-xs"
                                >
                                    <Plus className="mr-1 size-3.5" /> Add
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Comments & Discussion (Internal Team vs Client-Visible boundary) */}
                    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
                            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                <MessageSquare className="size-3.5" />
                                Discussion Feed
                            </div>

                            {/* Visibility Segmented Control */}
                            <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-xs dark:border-neutral-800 dark:bg-neutral-950">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCommentVisibility('internal')
                                    }
                                    className={cn(
                                        'flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                                        commentVisibility === 'internal'
                                            ? 'bg-white font-semibold text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100'
                                            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400',
                                    )}
                                >
                                    <Shield className="size-3 text-indigo-600" />
                                    Internal Team
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCommentVisibility('client')
                                    }
                                    className={cn(
                                        'flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
                                        commentVisibility === 'client'
                                            ? 'bg-white font-semibold text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100'
                                            : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400',
                                    )}
                                >
                                    <Users className="size-3 text-blue-600" />
                                    Client Visible
                                </button>
                            </div>
                        </div>

                        {/* Comment Input */}
                        <form onSubmit={handleAddComment} className="space-y-2">
                            <div className="relative">
                                <textarea
                                    value={newComment}
                                    onChange={(e) =>
                                        setNewComment(e.target.value)
                                    }
                                    placeholder={
                                        commentVisibility === 'internal'
                                            ? 'Add internal note (only visible to agency team)...'
                                            : 'Add note visible to client in approval portal...'
                                    }
                                    rows={2}
                                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/50 dark:focus:ring-indigo-400"
                                />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 text-[11px] text-neutral-400">
                                    {commentVisibility === 'internal' ? (
                                        <>
                                            <Shield className="size-3 text-indigo-500" />{' '}
                                            Confidential internal note
                                        </>
                                    ) : (
                                        <>
                                            <Users className="size-3 text-blue-500" />{' '}
                                            Client portal visible
                                        </>
                                    )}
                                </span>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!newComment.trim()}
                                    className="h-7 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                                >
                                    <Send className="mr-1 size-3" /> Post Note
                                </Button>
                            </div>
                        </form>

                        {/* Comment Stream */}
                        <div className="space-y-3 divide-y divide-neutral-100 pt-2 dark:divide-neutral-800">
                            {(currentTask.comments || []).length === 0 ? (
                                <p className="py-4 text-center text-xs text-neutral-400">
                                    No comments posted yet.
                                </p>
                            ) : (
                                (currentTask.comments || []).map((comm) => (
                                    <div
                                        key={comm.id}
                                        className="space-y-1.5 pt-3 text-xs first:pt-0"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {comm.user.name}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'font-mono text-[9px] uppercase',
                                                        comm.visibility ===
                                                            'internal'
                                                            ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/40'
                                                            : 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900 dark:bg-blue-950/40',
                                                    )}
                                                >
                                                    {comm.visibility}
                                                </Badge>
                                            </div>
                                            <span className="font-mono text-[10px] text-neutral-400">
                                                {comm.created_at}
                                            </span>
                                        </div>
                                        <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
                                            {comm.content}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Side Column (1 Col): Status, Assignee, Hours, Time Logging */}
                <div className="space-y-6">
                    {/* Status Transitions */}
                    <div className="space-y-2.5 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                            Workflow State
                        </span>
                        <div className="grid grid-cols-2 gap-1.5">
                            {statusOptions.map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleStatusChange(opt.id)}
                                    className={cn(
                                        'rounded-lg border px-2.5 py-1.5 text-center text-xs font-medium transition-all',
                                        currentTask.status === opt.id
                                            ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300'
                                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800',
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Assignee & Dates */}
                    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 text-xs shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                            Assignments & Schedule
                        </span>

                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">
                                    Assignee:
                                </span>
                                <span className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
                                    <UserCheck className="size-3.5 text-indigo-600" />
                                    {currentTask.assigned_user?.name ||
                                        'Unassigned'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">
                                    Start Date:
                                </span>
                                <span className="font-mono text-neutral-800 dark:text-neutral-200">
                                    {currentTask.start_date || 'Not set'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-neutral-500">
                                    Due Date:
                                </span>
                                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                                    {currentTask.due_date || 'Not set'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-t border-neutral-100 pt-1 dark:border-neutral-800">
                                <span className="text-neutral-500">
                                    Client Portal:
                                </span>
                                <span className="flex items-center gap-1 font-medium text-neutral-700 dark:text-neutral-300">
                                    {currentTask.is_client_visible ? (
                                        <>
                                            <Eye className="size-3 text-emerald-600" />{' '}
                                            Visible
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="size-3 text-neutral-400" />{' '}
                                            Internal Only
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Hours Calculation & Progress (Hours over Task Count Principle) */}
                    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 text-xs shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                                Capacity & Effort Hours
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                                {percentUsed}% used
                            </span>
                        </div>

                        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all',
                                    percentUsed > 100
                                        ? 'bg-red-500'
                                        : percentUsed > 85
                                          ? 'bg-amber-500'
                                          : 'bg-indigo-600 dark:bg-indigo-500',
                                )}
                                style={{ width: `${percentUsed}%` }}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-950">
                                <div className="text-[10px] text-neutral-400">
                                    Estimate
                                </div>
                                <div className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                                    {currentTask.estimate_hours}h
                                </div>
                            </div>
                            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-950">
                                <div className="text-[10px] text-neutral-400">
                                    Spent
                                </div>
                                <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                    {currentTask.spent_hours}h
                                </div>
                            </div>
                            <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2 dark:border-neutral-800 dark:bg-neutral-950">
                                <div className="text-[10px] text-neutral-400">
                                    Remaining
                                </div>
                                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                    {currentTask.remaining_hours}h
                                </div>
                            </div>
                        </div>

                        {/* Quick Time Logging Form */}
                        <form
                            onSubmit={handleLogTime}
                            className="space-y-2 border-t border-neutral-100 pt-2 dark:border-neutral-800"
                        >
                            <div className="font-medium text-neutral-700 dark:text-neutral-300">
                                Log Effort Time
                            </div>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    step="0.25"
                                    min="0.1"
                                    value={logHours}
                                    onChange={(e) =>
                                        setLogHours(e.target.value)
                                    }
                                    placeholder="Hours"
                                    className="h-8 w-20 font-mono text-xs"
                                />
                                <Input
                                    type="text"
                                    value={logNotes}
                                    onChange={(e) =>
                                        setLogNotes(e.target.value)
                                    }
                                    placeholder="Notes (optional)..."
                                    className="h-8 flex-1 text-xs"
                                />
                            </div>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isLoggingTime}
                                className="h-8 w-full bg-neutral-900 text-xs text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900"
                            >
                                <Clock className="mr-1.5 size-3" /> Log Hours
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
