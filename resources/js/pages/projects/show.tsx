import { type TaskDetailData } from "@/components/tasks/task-detail-content";
import { TaskDetailDrawer } from "@/components/tasks/task-detail-drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import {
    AlertTriangle,
    Calendar,
    CheckCircle2,
    Clock,
    FileCheck2,
    FileText,
    Kanban,
    LayoutGrid,
    List,
    Plus,
    UserCheck,
} from "lucide-react";
import * as React from "react";

type ProjectDetail = {
    id: number;
    organization_id: number;
    client_id: number;
    name: string;
    slug: string;
    description?: string | null;
    status: "planning" | "in_progress" | "review" | "at_risk" | "completed";
    health: "on_track" | "at_risk" | "critical";
    health_reason?: string | null;
    billing_type: "retainer" | "fixed" | "time_and_materials";
    budget_hours: number;
    spent_hours: number;
    remaining_hours: number;
    budget_cents: number;
    start_date?: string | null;
    due_date?: string | null;
    client: {
        id: number;
        name: string;
        slug: string;
        health?: string;
        health_reason?: string | null;
    };
    lead?: {
        id: number;
        name: string;
        email: string;
    } | null;
    tasks: TaskDetailData[];
};

type Props = {
    project: ProjectDetail;
    initialView?: string;
};

export default function ProjectShow({
    project,
    initialView = "overview",
}: Props) {
    const page = usePage();
    const orgSlug = page.props.currentOrganization?.slug || "";
    const [currentView, setCurrentView] = React.useState(initialView);
    const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(
        null,
    );
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = React.useState(false);

    // Sync view change to URL query params
    const handleViewChange = (viewId: string) => {
        setCurrentView(viewId);
        const url = new URL(window.location.href);
        url.searchParams.set("view", viewId);
        window.history.replaceState({}, "", url.toString());
    };

    const handleOpenTask = (taskId: number) => {
        setSelectedTaskId(taskId);
        setIsDrawerOpen(true);
    };

    // Calculate budget burn metrics
    const burnPct =
        project.budget_hours > 0
            ? Math.min(
                  100,
                  Math.round(
                      (project.spent_hours / project.budget_hours) * 100,
                  ),
              )
            : 0;

    const completedTasksCount = project.tasks.filter(
        (t) => t.status === "completed",
    ).length;
    const progressPct =
        project.tasks.length > 0
            ? Math.round((completedTasksCount / project.tasks.length) * 100)
            : 0;

    // Quick add task form
    const {
        data: taskData,
        setData: setTaskData,
        processing: taskProcessing,
        reset: resetTask,
        errors: taskErrors,
    } = useForm({
        title: "",
        brief: "",
        priority: "normal",
        estimate_hours: "4.0",
        due_date: project.due_date || "",
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/${orgSlug}/tasks`,
            {
                client_id: project.client_id,
                project_id: project.id,
                client_name: project.client.name,
                project_name: project.name,
                title: taskData.title,
                brief: taskData.brief,
                priority: taskData.priority,
                estimate_hours: parseFloat(taskData.estimate_hours) || 4.0,
                due_date: taskData.due_date,
            },
            {
                onSuccess: () => {
                    setIsCreateTaskOpen(false);
                    resetTask();
                },
            },
        );
    };

    const handleUpdateTaskStatus = (taskId: number, newStatus: string) => {
        router.patch(
            `/${orgSlug}/tasks/${taskId}/status`,
            { status: newStatus },
            { preserveScroll: true },
        );
    };

    const views = [
        { id: "overview", label: "Overview", icon: LayoutGrid },
        {
            id: "list",
            label: `List (${project.tasks.length})`,
            icon: List,
        },
        { id: "board", label: "Board", icon: Kanban },
        { id: "timeline", label: "Timeline", icon: Calendar },
        { id: "files", label: "Deliverables & Files", icon: FileCheck2 },
    ];

    const selectedTask =
        project.tasks.find((t) => t.id === selectedTaskId) || null;

    return (
        <>
            <Head title={`${project.name} - Project Workspace`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Project Workspace Header */}
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                <Link
                                    href={`/${orgSlug}/clients/${project.client.id}`}
                                    className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    {project.client.name}
                                </Link>
                                <span>•</span>
                                <span className="text-neutral-600 capitalize dark:text-neutral-400">
                                    {project.billing_type.replace("_", " ")}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {project.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-xs font-semibold capitalize",
                                        project.health === "on_track" &&
                                            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
                                        project.health === "at_risk" &&
                                            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
                                        project.health === "critical" &&
                                            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                                    )}
                                >
                                    {project.health.replace("_", " ")}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="text-xs font-normal text-neutral-500 capitalize"
                                >
                                    {project.status.replace("_", " ")}
                                </Badge>
                            </div>

                            <p className="max-w-2xl text-xs text-neutral-500 dark:text-neutral-400">
                                {project.description ||
                                    "Multi-discipline production project scope."}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                                <div className="flex items-center gap-1">
                                    <UserCheck className="size-3.5 text-neutral-400" />
                                    <span>
                                        Lead:{" "}
                                        {project.lead?.name || "Unassigned"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-3.5 text-neutral-400" />
                                    <span>
                                        Target Delivery:{" "}
                                        {project.due_date || "Ongoing"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Top Action & Metrics Bar */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-4 rounded-lg bg-neutral-50 px-4 py-2 text-right dark:bg-neutral-800/60">
                                <div>
                                    <div className="text-[10px] tracking-wider text-neutral-400 uppercase">
                                        Budget Burn
                                    </div>
                                    <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                        {project.spent_hours}h /{" "}
                                        {project.budget_hours}h
                                    </div>
                                </div>
                                <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
                                <div>
                                    <div className="text-[10px] tracking-wider text-neutral-400 uppercase">
                                        Progress
                                    </div>
                                    <div className="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                        {progressPct}%
                                    </div>
                                </div>
                            </div>

                            <Dialog
                                open={isCreateTaskOpen}
                                onOpenChange={setIsCreateTaskOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="h-9 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                                    >
                                        <Plus className="mr-1.5 size-3.5" />
                                        New Task
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Add Deliverable Task
                                        </DialogTitle>
                                        <DialogDescription>
                                            Create a production task linked to{" "}
                                            {project.name}.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleCreateTask}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="task-title"
                                                className="text-xs font-medium"
                                            >
                                                Task Title *
                                            </Label>
                                            <Input
                                                id="task-title"
                                                placeholder="e.g. Cut 30s social teaser variant"
                                                value={taskData.title}
                                                onChange={(e) =>
                                                    setTaskData(
                                                        "title",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="h-8 text-xs"
                                            />
                                            {taskErrors.title && (
                                                <p className="text-[11px] text-red-600">
                                                    {taskErrors.title}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="task-brief"
                                                className="text-xs font-medium"
                                            >
                                                Executive Brief
                                            </Label>
                                            <Input
                                                id="task-brief"
                                                placeholder="Key instructions and deliverables..."
                                                value={taskData.brief}
                                                onChange={(e) =>
                                                    setTaskData(
                                                        "brief",
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8 text-xs"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor="task-priority"
                                                    className="text-xs font-medium"
                                                >
                                                    Priority
                                                </Label>
                                                <select
                                                    id="task-priority"
                                                    value={taskData.priority}
                                                    onChange={(e) =>
                                                        setTaskData(
                                                            "priority",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-8 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-xs dark:border-neutral-800 dark:bg-neutral-900"
                                                >
                                                    <option value="urgent">
                                                        Urgent
                                                    </option>
                                                    <option value="high">
                                                        High
                                                    </option>
                                                    <option value="normal">
                                                        Normal
                                                    </option>
                                                    <option value="low">
                                                        Low
                                                    </option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor="task-estimate"
                                                    className="text-xs font-medium"
                                                >
                                                    Estimate Hours
                                                </Label>
                                                <Input
                                                    id="task-estimate"
                                                    type="number"
                                                    step="0.5"
                                                    value={
                                                        taskData.estimate_hours
                                                    }
                                                    onChange={(e) =>
                                                        setTaskData(
                                                            "estimate_hours",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-8 text-xs"
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setIsCreateTaskOpen(false)
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={taskProcessing}
                                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                            >
                                                Add Task
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Health Reason Explanation Banner */}
                    {project.health !== "on_track" && project.health_reason && (
                        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div>
                                <span className="font-semibold">
                                    Project Risk Warning:{" "}
                                </span>
                                {project.health_reason}
                            </div>
                        </div>
                    )}
                </div>

                {/* View Switcher Tabs */}
                <div className="flex items-center justify-between border-b border-neutral-200 pb-px dark:border-neutral-800">
                    <div className="flex gap-1 overflow-x-auto">
                        {views.map((v) => {
                            const Icon = v.icon;
                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => handleViewChange(v.id)}
                                    className={cn(
                                        "flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-medium transition-colors",
                                        currentView === v.id
                                            ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                                            : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
                                    )}
                                >
                                    <Icon className="size-3.5" />
                                    <span>{v.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* VIEW 1: Overview */}
                {currentView === "overview" && (
                    <div className="space-y-6">
                        {/* Budget Burn & Deliverable Summary Grid */}
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {/* Budget Burn Meter Card */}
                            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                        Budget Burn Meter
                                    </span>
                                    <Clock className="size-4 text-neutral-400" />
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="font-mono text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                        {burnPct}%
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                        of {project.budget_hours}h consumed
                                    </span>
                                </div>

                                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            burnPct > 90
                                                ? "bg-red-500"
                                                : burnPct > 75
                                                  ? "bg-amber-500"
                                                  : "bg-indigo-600",
                                        )}
                                        style={{ width: `${burnPct}%` }}
                                    />
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800">
                                    <div>
                                        <span className="block text-[10px] text-neutral-400 uppercase">
                                            Spent
                                        </span>
                                        <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                                            {project.spent_hours} hrs
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] text-neutral-400 uppercase">
                                            Remaining
                                        </span>
                                        <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                                            {project.remaining_hours} hrs
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Deliverables Completion Progress Card */}
                            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                        Deliverables Velocity
                                    </span>
                                    <CheckCircle2 className="size-4 text-emerald-500" />
                                </div>
                                <div className="mt-4 flex items-baseline gap-2">
                                    <span className="font-mono text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                                        {completedTasksCount} /{" "}
                                        {project.tasks.length}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                        deliverables finished
                                    </span>
                                </div>

                                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500 dark:border-neutral-800">
                                    <span>Target Delivery Date</span>
                                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {project.due_date || "Flexible"}
                                    </span>
                                </div>
                            </div>

                            {/* Client Alignment Card */}
                            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                        Client Alignment
                                    </span>
                                    <FileText className="size-4 text-neutral-400" />
                                </div>
                                <div className="mt-4 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">
                                            Client:
                                        </span>
                                        <Link
                                            href={`/${orgSlug}/clients/${project.client.id}`}
                                            className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            {project.client.name}
                                        </Link>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">
                                            Delivery Lead:
                                        </span>
                                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                                            {project.lead?.name || "Unassigned"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">
                                            Contract Type:
                                        </span>
                                        <span className="font-medium text-neutral-900 capitalize dark:text-neutral-100">
                                            {project.billing_type.replace(
                                                "_",
                                                " ",
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Tasks List */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Active Deliverables & Checklist Status
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => handleViewChange("list")}
                                    className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    View full table →
                                </button>
                            </div>

                            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {project.tasks.length === 0 ? (
                                    <div className="py-6 text-center text-xs text-neutral-500">
                                        No tasks created yet. Click "New Task"
                                        to add one.
                                    </div>
                                ) : (
                                    project.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            onClick={() =>
                                                handleOpenTask(task.id)
                                            }
                                            className="flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="text-xs font-medium text-neutral-900 hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400">
                                                    {task.title}
                                                </div>
                                                <div className="text-[11px] text-neutral-400">
                                                    Assignee:{" "}
                                                    {task.assigned_user?.name ||
                                                        "Unassigned"}{" "}
                                                    •{" "}
                                                    {
                                                        (task.checklists || [])
                                                            .length
                                                    }{" "}
                                                    checklists
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px] capitalize",
                                                        task.priority ===
                                                            "urgent" &&
                                                            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                                                        task.priority ===
                                                            "high" &&
                                                            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
                                                    )}
                                                >
                                                    {task.priority}
                                                </Badge>
                                                <span className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                                                    {task.spent_hours}h /{" "}
                                                    {task.estimate_hours}h
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* VIEW 2: Table List View */}
                {currentView === "list" && (
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-neutral-200 bg-neutral-50/70 font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50">
                                <tr>
                                    <th className="px-4 py-3">Task Title</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Assignee</th>
                                    <th className="px-4 py-3">Effort Hours</th>
                                    <th className="px-4 py-3">Due Date</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {project.tasks.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-xs text-neutral-500"
                                        >
                                            No deliverables recorded. Click "New
                                            Task" to add deliverables.
                                        </td>
                                    </tr>
                                ) : (
                                    project.tasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            onClick={() =>
                                                handleOpenTask(task.id)
                                            }
                                            className="cursor-pointer transition-colors hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40"
                                        >
                                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                <div>{task.title}</div>
                                                <div className="text-[11px] font-normal text-neutral-400">
                                                    {
                                                        (task.checklists || [])
                                                            .length
                                                    }{" "}
                                                    subtasks
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px] font-semibold capitalize",
                                                        task.priority ===
                                                            "urgent" &&
                                                            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                                                        task.priority ===
                                                            "high" &&
                                                            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
                                                        task.priority ===
                                                            "normal" &&
                                                            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400",
                                                    )}
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700 capitalize dark:bg-neutral-800 dark:text-neutral-300">
                                                    {task.status.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">
                                                {task.assigned_user?.name ||
                                                    "Unassigned"}
                                            </td>
                                            <td className="px-4 py-3 font-mono">
                                                {task.spent_hours}h /{" "}
                                                {task.estimate_hours}h
                                            </td>
                                            <td className="px-4 py-3 text-neutral-500">
                                                {task.due_date || "-"}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 text-xs text-indigo-600 hover:text-indigo-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenTask(task.id);
                                                    }}
                                                >
                                                    Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* VIEW 3: Interactive Kanban Board */}
                {currentView === "board" && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
                        {(
                            [
                                "todo",
                                "in_progress",
                                "review",
                                "blocked",
                                "completed",
                            ] as const
                        ).map((statusCol) => {
                            const colTasks = project.tasks.filter(
                                (t) => t.status === statusCol,
                            );

                            return (
                                <div
                                    key={statusCol}
                                    className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50"
                                >
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-xs font-semibold text-neutral-700 capitalize dark:text-neutral-300">
                                            {statusCol.replace("_", " ")}
                                        </span>
                                        <Badge
                                            variant="secondary"
                                            className="text-[10px]"
                                        >
                                            {colTasks.length}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {colTasks.map((t) => (
                                            <div
                                                key={t.id}
                                                onClick={() =>
                                                    handleOpenTask(t.id)
                                                }
                                                className="cursor-pointer rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs transition-all hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-[10px] capitalize",
                                                            t.priority ===
                                                                "urgent" &&
                                                                "border-red-200 bg-red-50 text-red-700",
                                                            t.priority ===
                                                                "high" &&
                                                                "border-amber-200 bg-amber-50 text-amber-700",
                                                        )}
                                                    >
                                                        {t.priority}
                                                    </Badge>
                                                    <span className="font-mono text-[10px] text-neutral-400">
                                                        {t.remaining_hours}h
                                                        left
                                                    </span>
                                                </div>

                                                <h4 className="mt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {t.title}
                                                </h4>

                                                <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2 text-[11px] text-neutral-400 dark:border-neutral-800">
                                                    <span>
                                                        {t.assigned_user
                                                            ?.name ||
                                                            "Unassigned"}
                                                    </span>

                                                    {/* Quick Transition Selector */}
                                                    <select
                                                        value={t.status}
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        onChange={(e) =>
                                                            handleUpdateTaskStatus(
                                                                t.id,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 text-[10px] dark:border-neutral-700 dark:bg-neutral-800"
                                                    >
                                                        <option value="todo">
                                                            To Do
                                                        </option>
                                                        <option value="in_progress">
                                                            In Progress
                                                        </option>
                                                        <option value="review">
                                                            Review
                                                        </option>
                                                        <option value="blocked">
                                                            Blocked
                                                        </option>
                                                        <option value="completed">
                                                            Done
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* VIEW 4: Timeline View */}
                {currentView === "timeline" && (
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4">
                            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                Project Milestone & Deliverable Schedule
                            </h2>
                            <p className="text-xs text-neutral-500">
                                Target delivery timeline across deliverables and
                                sprints
                            </p>
                        </div>

                        <div className="space-y-4">
                            {project.tasks.map((t, idx) => (
                                <div
                                    key={t.id}
                                    onClick={() => handleOpenTask(t.id)}
                                    className="cursor-pointer rounded-lg border border-neutral-100 p-3.5 transition-colors hover:bg-neutral-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-5 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                                                {idx + 1}
                                            </span>
                                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                                {t.title}
                                            </span>
                                        </div>
                                        <span className="text-neutral-500">
                                            Due: {t.due_date || "TBD"}
                                        </span>
                                    </div>

                                    {/* Visual timeline bar */}
                                    <div className="mt-2 flex items-center gap-3">
                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full",
                                                    t.status === "completed"
                                                        ? "bg-emerald-500"
                                                        : t.status === "blocked"
                                                          ? "bg-red-500"
                                                          : "bg-indigo-600",
                                                )}
                                                style={{
                                                    width:
                                                        t.status === "completed"
                                                            ? "100%"
                                                            : `${Math.min(100, Math.round((t.spent_hours / (t.estimate_hours || 1)) * 100))}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="font-mono text-[10px] text-neutral-400">
                                            {t.spent_hours}h /{" "}
                                            {t.estimate_hours}h
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* VIEW 5: Deliverables & Asset Packages */}
                {currentView === "files" && (
                    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Deliverable Assets & Client Review Packages
                                </h2>
                                <p className="text-xs text-neutral-500">
                                    Export packages, versions, and client
                                    approval status
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-neutral-200 bg-neutral-50/70 font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50">
                                    <tr>
                                        <th className="px-4 py-3">
                                            Asset Package
                                        </th>
                                        <th className="px-4 py-3">Version</th>
                                        <th className="px-4 py-3">Format</th>
                                        <th className="px-4 py-3">
                                            Approval State
                                        </th>
                                        <th className="px-4 py-3">Updated</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                            Hero Cut Master - Broadcast Pass
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            v2.1
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            ProRes 4444 (4K)
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="outline"
                                                className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
                                            >
                                                Approved
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            Yesterday
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                            TikTok Hook Variant A / B / C Cuts
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            v1.0
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            MP4 / H.264 (9:16)
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="outline"
                                                className="border-purple-200 bg-purple-50 text-[10px] text-purple-700"
                                            >
                                                In Client Review
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            3 hours ago
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                            Design Token & Spec Package (JSON)
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            v3.0-rc
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            ZIP / Tokens
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="outline"
                                                className="border-amber-200 bg-amber-50 text-[10px] text-amber-700"
                                            >
                                                Changes Requested
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            Sep 7, 2026
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Contextual Task Drawer */}
            <TaskDetailDrawer
                task={selectedTask}
                open={isDrawerOpen}
                onOpenChange={(open) => {
                    setIsDrawerOpen(open);
                    if (!open) setSelectedTaskId(null);
                }}
            />
        </>
    );
}

ProjectShow.layout = (props: {
    project?: ProjectDetail;
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Projects",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/projects`
                : "/projects",
        },
        {
            title: props.project?.name ?? "Project Details",
            href:
                props.currentOrganization && props.project
                    ? `/${props.currentOrganization.slug}/projects/${props.project.id}`
                    : "#",
        },
    ],
});
