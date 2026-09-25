import type { TaskDetailData } from "@/components/tasks/task-detail-content";
import { TaskDetailDrawer } from "@/components/tasks/task-detail-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { Clock, ExternalLink, Flame, Pause, Play, Timer } from "lucide-react";
import * as React from "react";

type Props = {
    initialTab?: string;
    tasks?: TaskDetailData[];
};

const DEFAULT_FALLBACK_TASKS: TaskDetailData[] = [
    {
        id: 1,
        client_name: "Acme Corp",
        project_name: "Q4 Product Launch",
        title: "Color grade 60-second hero commercial for TV/YouTube broadcast",
        brief: "Deliver final color grade conforming to REC.709 with highlight roll-off matching brand master.",
        priority: "urgent",
        status: "in_progress",
        start_date: "2026-09-08",
        due_date: "2026-09-08",
        estimate_hours: 6.0,
        spent_hours: 3.5,
        remaining_hours: 2.5,
        is_client_visible: true,
        dependencies_summary: "Requires approved sound mix",
        checklists: [
            {
                id: 1,
                title: "Conform RAW RED files",
                is_completed: true,
                completed_at: "2026-09-08",
                sort_order: 0,
            },
            {
                id: 2,
                title: "Shot-matching across scenes",
                is_completed: true,
                completed_at: "2026-09-08",
                sort_order: 1,
            },
            {
                id: 3,
                title: "Client hero look grade",
                is_completed: false,
                completed_at: null,
                sort_order: 2,
            },
        ],
        comments: [
            {
                id: 1,
                user: {
                    id: 1,
                    name: "Taylor Otwell",
                    email: "taylor@example.com",
                },
                content:
                    "Client requested warmer tones in the closing hero frame.",
                visibility: "internal",
                created_at: "2 hours ago",
            },
        ],
    },
    {
        id: 2,
        client_name: "Apex Retail Group",
        project_name: "Reels Retainer",
        title: "Edit 3 viral hook variants for TikTok campaign deliverable",
        brief: "Create three 5-second opening variations designed for high retention testing.",
        priority: "high",
        status: "todo",
        start_date: "2026-09-08",
        due_date: "2026-09-09",
        estimate_hours: 4.0,
        spent_hours: 0.0,
        remaining_hours: 4.0,
        is_client_visible: false,
        dependencies_summary: null,
        checklists: [],
    },
    {
        id: 3,
        client_name: "Pulse Health",
        project_name: "Brand Refresh",
        title: "Export approved SVG tokens and typography styleguide for dev team",
        brief: "Deliver finalized color and font JSON tokens to the client engineering repository.",
        priority: "normal",
        status: "todo",
        start_date: "2026-09-09",
        due_date: "2026-09-12",
        estimate_hours: 2.0,
        spent_hours: 0.0,
        remaining_hours: 2.0,
        is_client_visible: true,
        dependencies_summary: null,
        checklists: [],
    },
    {
        id: 4,
        client_name: "Strata FinTech",
        project_name: "SEO Core Migration",
        title: "Resolve canonical tag conflicts on checkout subpaths",
        brief: "Fix self-referencing canonical discrepancies flagged during the automated crawl.",
        priority: "urgent",
        status: "blocked",
        start_date: "2026-09-01",
        due_date: "2026-09-05",
        estimate_hours: 5.0,
        spent_hours: 2.0,
        remaining_hours: 3.0,
        is_client_visible: true,
        dependencies_summary: "Waiting for staging server access",
        checklists: [],
    },
    {
        id: 5,
        client_name: "Luminary Co.",
        project_name: "Social Retainer",
        title: "12x Instagram Story asset packaging",
        brief: "Package design deliverables and export PNG assets for social publishing.",
        priority: "normal",
        status: "review",
        start_date: "2026-09-04",
        due_date: "2026-09-07",
        estimate_hours: 3.5,
        spent_hours: 3.0,
        remaining_hours: 0.5,
        is_client_visible: true,
        dependencies_summary: null,
        checklists: [],
    },
];

export default function MyWork({ initialTab = "today", tasks = [] }: Props) {
    const allTasks: TaskDetailData[] =
        tasks.length > 0 ? tasks : DEFAULT_FALLBACK_TASKS;

    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [selectedDrawerTask, setSelectedDrawerTask] =
        React.useState<TaskDetailData | null>(null);
    const [focusedTaskId, setFocusedTaskId] = React.useState<number>(
        allTasks[0]?.id || 1,
    );
    const [isTimerRunning, setIsTimerRunning] = React.useState(false);
    const [timerSeconds, setTimerSeconds] = React.useState(1420); // 23m 40s

    React.useEffect(() => {
        let interval: any = null;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimerSeconds((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTimer = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Partition tasks into tabs
    const todayStr = new Date().toISOString().split("T")[0];

    const getTaskTab = (t: TaskDetailData): string => {
        if (t.status === "completed") return "completed";
        if (t.status === "review") return "review";
        if (t.status === "blocked") return "blocked";
        if (t.due_date && t.due_date < todayStr) return "overdue";
        if (t.due_date && t.due_date === todayStr) return "today";
        return "upcoming";
    };

    const tabs = [
        {
            id: "today",
            label: "Today",
            count: allTasks.filter((t) => getTaskTab(t) === "today").length,
        },
        {
            id: "upcoming",
            label: "Upcoming",
            count: allTasks.filter((t) => getTaskTab(t) === "upcoming").length,
        },
        {
            id: "overdue",
            label: "Overdue",
            count: allTasks.filter((t) => getTaskTab(t) === "overdue").length,
        },
        {
            id: "blocked",
            label: "Blocked",
            count: allTasks.filter((t) => getTaskTab(t) === "blocked").length,
        },
        {
            id: "review",
            label: "Review",
            count: allTasks.filter((t) => getTaskTab(t) === "review").length,
        },
        {
            id: "completed",
            label: "Completed",
            count: allTasks.filter((t) => getTaskTab(t) === "completed").length,
        },
    ];

    const currentTasks = allTasks.filter((t) => getTaskTab(t) === activeTab);
    const focusedTask =
        allTasks.find((t) => t.id === focusedTaskId) || allTasks[0];

    return (
        <>
            <Head title="My Work - AgencyOS" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Header & Quick Timer Bar */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            My Work
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Personal task queue, focus mode, and assigned effort
                            hours
                        </p>
                    </div>

                    {/* Active Effort Timer */}
                    <div className="flex items-center gap-2.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <Timer className="size-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                            {formatTimer(timerSeconds)}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                            className="h-6 px-2 text-[11px] text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                        >
                            {isTimerRunning ? (
                                <>
                                    <Pause className="mr-1 size-3" /> Pause
                                </>
                            ) : (
                                <>
                                    <Play className="mr-1 size-3" /> Start
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto border-b border-neutral-200 pb-px dark:border-neutral-800">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                                activeTab === tab.id
                                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                    : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200",
                            )}
                        >
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span
                                    className={cn(
                                        "py-0.2 rounded-full px-1.5 text-[10px] font-semibold",
                                        activeTab === tab.id
                                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
                                    )}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Task List and Focus Sidebar Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Task Rows (2 Cols) */}
                    <div className="space-y-2.5 lg:col-span-2">
                        {currentTasks.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-neutral-200 p-12 text-center text-xs text-neutral-400 dark:border-neutral-800">
                                No tasks in &ldquo;{activeTab}&rdquo;.
                            </div>
                        ) : (
                            currentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => {
                                        setFocusedTaskId(task.id);
                                        setSelectedDrawerTask(task);
                                    }}
                                    className={cn(
                                        "cursor-pointer space-y-2.5 rounded-xl border bg-white p-4 transition-all hover:border-neutral-300 dark:bg-neutral-900 dark:hover:border-neutral-700",
                                        focusedTask?.id === task.id
                                            ? "border-indigo-400 shadow-xs ring-1 ring-indigo-400/20 dark:border-indigo-600"
                                            : "border-neutral-200/80 dark:border-neutral-800",
                                    )}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                                {task.client_name}
                                            </span>
                                            <span className="text-neutral-300 dark:text-neutral-700">
                                                ·
                                            </span>
                                            <span className="text-xs text-neutral-500">
                                                {task.project_name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-[10px] font-semibold uppercase",
                                                    task.priority ===
                                                        "urgent" &&
                                                        "border-red-200 bg-red-50 text-red-600 dark:bg-red-950/40",
                                                    task.priority === "high" &&
                                                        "border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/40",
                                                    task.priority ===
                                                        "normal" &&
                                                        "border-neutral-200 bg-neutral-50 text-neutral-600 dark:bg-neutral-800",
                                                )}
                                            >
                                                {task.priority}
                                            </Badge>
                                            <span className="flex items-center gap-1 font-mono text-xs text-neutral-400">
                                                <Clock className="size-3" />
                                                {task.remaining_hours}h left
                                            </span>
                                        </div>
                                    </div>

                                    <h4 className="text-sm leading-snug font-medium text-neutral-800 dark:text-neutral-200">
                                        {task.title}
                                    </h4>

                                    <div className="flex items-center justify-between border-t border-neutral-100 pt-1 text-xs text-neutral-500 dark:border-neutral-800/80">
                                        <span>
                                            Due: {task.due_date || "No date"}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[11px]">
                                                Est: {task.estimate_hours}h (
                                                {task.remaining_hours}h
                                                remaining)
                                            </span>
                                            <span className="flex items-center gap-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                                Details{" "}
                                                <ExternalLink className="size-3" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Focus Mode Panel (1 Col) */}
                    {focusedTask && (
                        <div className="h-fit space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                    <Flame className="size-4" /> Focus Mode
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="text-[10px] capitalize"
                                >
                                    {focusedTask.status.replace("_", " ")}
                                </Badge>
                            </div>

                            <div className="space-y-1">
                                <span className="text-xs text-neutral-400">
                                    {focusedTask.client_name} ·{" "}
                                    {focusedTask.project_name}
                                </span>
                                <h3 className="text-sm leading-snug font-semibold text-neutral-900 dark:text-neutral-100">
                                    {focusedTask.title}
                                </h3>
                            </div>

                            <div className="space-y-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-950">
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">
                                        Remaining Effort:
                                    </span>
                                    <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                                        {focusedTask.remaining_hours} hours
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">
                                        Deadline:
                                    </span>
                                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                        {focusedTask.due_date || "None"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">
                                        Timer State:
                                    </span>
                                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                        {isTimerRunning ? "Running" : "Paused"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        setIsTimerRunning(!isTimerRunning)
                                    }
                                    className="h-8 w-full bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                                >
                                    {isTimerRunning
                                        ? "Pause Time Tracker"
                                        : "Start Focus Timer"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setSelectedDrawerTask(focusedTask)
                                    }
                                    className="h-8 w-full text-xs"
                                >
                                    Open Full Task Detail
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Contextual Task Detail Drawer */}
            <TaskDetailDrawer
                task={selectedDrawerTask}
                open={selectedDrawerTask !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedDrawerTask(null);
                }}
            />
        </>
    );
}

MyWork.layout = (props: { currentOrganization?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: "My Work",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/my-work`
                : "/my-work",
        },
    ],
});
