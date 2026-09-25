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
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import {
    AlertTriangle,
    ArrowUpRight,
    Briefcase,
    Calendar,
    CheckCircle2,
    DollarSign,
    FolderGit2,
    Mail,
    Plus,
    TrendingUp,
    UserCheck,
} from "lucide-react";
import * as React from "react";

type ProjectSummary = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    status: "planning" | "in_progress" | "review" | "at_risk" | "completed";
    health: "on_track" | "at_risk" | "critical";
    health_reason?: string | null;
    budget_hours: number;
    spent_hours: number;
    remaining_hours: number;
    start_date?: string | null;
    due_date?: string | null;
    tasks_count?: number;
    lead?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

type ClientDetail = {
    id: number;
    name: string;
    slug: string;
    status: "active" | "onboarding" | "at_risk" | "churned";
    health: "healthy" | "at_risk" | "critical";
    health_reason?: string | null;
    services: string[] | null;
    monthly_retainer_cents: number;
    margin_percent: number;
    lead_contact_name?: string | null;
    lead_contact_email?: string | null;
    owner?: {
        id: number;
        name: string;
        email: string;
    } | null;
    projects: ProjectSummary[];
    tasks: TaskDetailData[];
};

type Props = {
    client: ClientDetail;
    initialTab?: string;
};

export default function ClientShow({ client, initialTab = "overview" }: Props) {
    const page = usePage();
    const orgSlug = page.props.currentOrganization?.slug || "";
    const [activeTab, setActiveTab] = React.useState(initialTab);
    const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(
        null,
    );
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = React.useState(false);

    const {
        data: projectData,
        setData: setProjectData,
        post: postProject,
        processing: projectProcessing,
        reset: resetProject,
        errors: projectErrors,
    } = useForm({
        name: "",
        client_id: client.id.toString(),
        description: "",
        billing_type: "retainer",
        budget_hours: "40",
        due_date: "",
    });

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        postProject(`/${orgSlug}/projects`, {
            onSuccess: () => {
                setIsCreateProjectOpen(false);
                resetProject();
            },
        });
    };

    const handleOpenTask = (taskId: number) => {
        setSelectedTaskId(taskId);
        setIsDrawerOpen(true);
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(cents / 100);
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "projects", label: `Projects (${client.projects.length})` },
        { id: "work", label: `Work & Deliverables (${client.tasks.length})` },
    ];

    const selectedTask =
        client.tasks.find((t) => t.id === selectedTaskId) || null;

    return (
        <>
            <Head title={`${client.name} - Client Workspace`} />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Client Workspace Header */}
                <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {client.name}
                                </h1>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-xs font-semibold capitalize",
                                        client.health === "healthy" &&
                                            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
                                        client.health === "at_risk" &&
                                            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
                                        client.health === "critical" &&
                                            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                                    )}
                                >
                                    {client.health.replace("_", " ")}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="text-xs font-normal text-neutral-500 capitalize"
                                >
                                    {client.status}
                                </Badge>
                            </div>

                            {/* Contact & Services meta */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                                {client.lead_contact_name && (
                                    <div className="flex items-center gap-1">
                                        <UserCheck className="size-3.5 text-neutral-400" />
                                        <span>{client.lead_contact_name}</span>
                                    </div>
                                )}
                                {client.lead_contact_email && (
                                    <div className="flex items-center gap-1">
                                        <Mail className="size-3.5 text-neutral-400" />
                                        <a
                                            href={`mailto:${client.lead_contact_email}`}
                                            className="hover:underline"
                                        >
                                            {client.lead_contact_email}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Briefcase className="size-3.5 text-neutral-400" />
                                    <span>
                                        Account Owner:{" "}
                                        {client.owner?.name || "Operations"}
                                    </span>
                                </div>
                            </div>

                            {/* Services badges */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {(client.services || []).map((s, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                                    >
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Top Financial & Action Panel */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="flex items-center gap-4 rounded-lg bg-neutral-50 px-4 py-2 text-right dark:bg-neutral-800/60">
                                <div>
                                    <div className="text-[10px] tracking-wider text-neutral-400 uppercase">
                                        Monthly Retainer
                                    </div>
                                    <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                        {formatCurrency(
                                            client.monthly_retainer_cents,
                                        )}
                                    </div>
                                </div>
                                <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-700" />
                                <div>
                                    <div className="text-[10px] tracking-wider text-neutral-400 uppercase">
                                        Target Margin
                                    </div>
                                    <div className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                        {client.margin_percent}%
                                    </div>
                                </div>
                            </div>

                            <Dialog
                                open={isCreateProjectOpen}
                                onOpenChange={setIsCreateProjectOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        className="h-9 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                                    >
                                        <Plus className="mr-1.5 size-3.5" />
                                        New Project
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Create Project for {client.name}
                                        </DialogTitle>
                                        <DialogDescription>
                                            Set up a project with allocated
                                            budget hours and delivery
                                            milestones.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleCreateProject}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="project-name"
                                                className="text-xs font-medium"
                                            >
                                                Project Name *
                                            </Label>
                                            <Input
                                                id="project-name"
                                                placeholder="e.g. Q4 Growth Video Campaign"
                                                value={projectData.name}
                                                onChange={(e) =>
                                                    setProjectData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                className="h-8 text-xs"
                                            />
                                            {projectErrors.name && (
                                                <p className="text-[11px] text-red-600">
                                                    {projectErrors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="project-description"
                                                className="text-xs font-medium"
                                            >
                                                Description & Goals
                                            </Label>
                                            <Input
                                                id="project-description"
                                                placeholder="Key objectives and deliverables..."
                                                value={projectData.description}
                                                onChange={(e) =>
                                                    setProjectData(
                                                        "description",
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8 text-xs"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor="project-budget-hours"
                                                    className="text-xs font-medium"
                                                >
                                                    Budget Hours *
                                                </Label>
                                                <Input
                                                    id="project-budget-hours"
                                                    type="number"
                                                    step="0.5"
                                                    placeholder="60"
                                                    value={
                                                        projectData.budget_hours
                                                    }
                                                    onChange={(e) =>
                                                        setProjectData(
                                                            "budget_hours",
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                    className="h-8 text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label
                                                    htmlFor="project-due-date"
                                                    className="text-xs font-medium"
                                                >
                                                    Target Delivery Date
                                                </Label>
                                                <Input
                                                    id="project-due-date"
                                                    type="date"
                                                    value={projectData.due_date}
                                                    onChange={(e) =>
                                                        setProjectData(
                                                            "due_date",
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
                                                    setIsCreateProjectOpen(
                                                        false,
                                                    )
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={projectProcessing}
                                                className="bg-indigo-600 text-white hover:bg-indigo-700"
                                            >
                                                Create Project
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Health Reason Explanation Banner */}
                    {client.health !== "healthy" && client.health_reason && (
                        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div>
                                <span className="font-semibold">
                                    Delivery Alert:{" "}
                                </span>
                                {client.health_reason}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-neutral-200 dark:border-neutral-800">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "border-b-2 px-4 py-2.5 text-xs font-medium transition-colors",
                                activeTab === tab.id
                                    ? "border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100"
                                    : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab: Overview */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        {/* Summary KPI Cards */}
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                                    <span className="text-xs font-medium">
                                        Active Projects
                                    </span>
                                    <FolderGit2 className="size-4" />
                                </div>
                                <div className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {client.projects.length}
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                                    <span className="text-xs font-medium">
                                        Active Deliverables
                                    </span>
                                    <CheckCircle2 className="size-4" />
                                </div>
                                <div className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {client.tasks.length}
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                                    <span className="text-xs font-medium">
                                        Monthly Retainer
                                    </span>
                                    <DollarSign className="size-4" />
                                </div>
                                <div className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                    {formatCurrency(
                                        client.monthly_retainer_cents,
                                    )}
                                </div>
                            </div>

                            <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                                    <span className="text-xs font-medium">
                                        Recognized Margin
                                    </span>
                                    <TrendingUp className="size-4 text-emerald-500" />
                                </div>
                                <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                                    {client.margin_percent}%
                                </div>
                            </div>
                        </div>

                        {/* Projects in this client */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                    Active Projects & Retainers
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("projects")}
                                    className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    View all projects →
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {client.projects.length === 0 ? (
                                    <div className="col-span-2 py-6 text-center text-xs text-neutral-500">
                                        No active projects yet. Click "New
                                        Project" to start.
                                    </div>
                                ) : (
                                    client.projects.map((proj) => {
                                        const burnPct =
                                            proj.budget_hours > 0
                                                ? Math.min(
                                                      100,
                                                      Math.round(
                                                          (proj.spent_hours /
                                                              proj.budget_hours) *
                                                              100,
                                                      ),
                                                  )
                                                : 0;

                                        return (
                                            <div
                                                key={proj.id}
                                                className="flex flex-col justify-between rounded-lg border border-neutral-100 p-4 transition-all hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between gap-2">
                                                        <Link
                                                            href={`/${orgSlug}/projects/${proj.id}`}
                                                            className="font-semibold text-neutral-900 hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400"
                                                        >
                                                            {proj.name}
                                                        </Link>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] capitalize",
                                                                proj.status ===
                                                                    "at_risk" &&
                                                                    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                                                                proj.status ===
                                                                    "review" &&
                                                                    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-400",
                                                                proj.status ===
                                                                    "in_progress" &&
                                                                    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400",
                                                            )}
                                                        >
                                                            {proj.status.replace(
                                                                "_",
                                                                " ",
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    <p className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                        {proj.description ||
                                                            "No description set."}
                                                    </p>
                                                </div>

                                                <div className="mt-4 space-y-2">
                                                    <div className="flex justify-between text-[11px] text-neutral-500">
                                                        <span>Budget Burn</span>
                                                        <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                                                            {proj.spent_hours}h
                                                            /{" "}
                                                            {proj.budget_hours}h
                                                            ({burnPct}%)
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all",
                                                                burnPct > 90
                                                                    ? "bg-red-500"
                                                                    : burnPct >
                                                                        75
                                                                      ? "bg-amber-500"
                                                                      : "bg-indigo-600",
                                                            )}
                                                            style={{
                                                                width: `${burnPct}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                                                        <span>
                                                            Lead:{" "}
                                                            {proj.lead?.name ||
                                                                "Unassigned"}
                                                        </span>
                                                        <Link
                                                            href={`/${orgSlug}/projects/${proj.id}`}
                                                            className="flex items-center text-indigo-600 hover:underline dark:text-indigo-400"
                                                        >
                                                            Open Workspace
                                                            <ArrowUpRight className="ml-1 size-3" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Recent Work / Tasks table */}
                        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <h2 className="mb-4 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                Deliverables & Production Tasks
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="border-b border-neutral-200 bg-neutral-50/70 font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50">
                                        <tr>
                                            <th className="px-4 py-3">Task</th>
                                            <th className="px-4 py-3">
                                                Priority
                                            </th>
                                            <th className="px-4 py-3">
                                                Status
                                            </th>
                                            <th className="px-4 py-3">
                                                Assignee
                                            </th>
                                            <th className="px-4 py-3">Hours</th>
                                            <th className="px-4 py-3">Due</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                        {client.tasks.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-4 py-6 text-center text-xs text-neutral-500"
                                                >
                                                    No tasks recorded for this
                                                    client.
                                                </td>
                                            </tr>
                                        ) : (
                                            client.tasks.map((task) => (
                                                <tr
                                                    key={task.id}
                                                    onClick={() =>
                                                        handleOpenTask(task.id)
                                                    }
                                                    className="cursor-pointer transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40"
                                                >
                                                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                        <div>{task.title}</div>
                                                        <div className="text-[11px] font-normal text-neutral-400">
                                                            {task.project_name}
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
                                                        {task.assigned_user
                                                            ?.name ||
                                                            "Unassigned"}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono">
                                                        {task.spent_hours}h /{" "}
                                                        {task.estimate_hours}h
                                                    </td>
                                                    <td className="px-4 py-3 text-neutral-500">
                                                        {task.due_date || "-"}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Projects */}
                {activeTab === "projects" && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {client.projects.map((proj) => (
                            <div
                                key={proj.id}
                                className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <Link
                                            href={`/${orgSlug}/projects/${proj.id}`}
                                            className="text-base font-bold text-neutral-900 hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400"
                                        >
                                            {proj.name}
                                        </Link>
                                        <Badge
                                            variant="outline"
                                            className="text-xs capitalize"
                                        >
                                            {proj.status.replace("_", " ")}
                                        </Badge>
                                    </div>
                                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                                        {proj.description ||
                                            "No description provided."}
                                    </p>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex justify-between text-xs text-neutral-500">
                                        <span>Budget Hours</span>
                                        <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
                                            {proj.spent_hours}h spent /{" "}
                                            {proj.budget_hours}h allocated
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-400 dark:border-neutral-800">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="size-3.5" />
                                            <span>
                                                Target: {proj.due_date || "TBD"}
                                            </span>
                                        </div>
                                        <Link
                                            href={`/${orgSlug}/projects/${proj.id}`}
                                            className="flex items-center font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                                        >
                                            Open Workspace
                                            <ArrowUpRight className="ml-1 size-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab: Work & Deliverables */}
                {activeTab === "work" && (
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-neutral-200 bg-neutral-50/70 font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50">
                                    <tr>
                                        <th className="px-4 py-3">Task</th>
                                        <th className="px-4 py-3">Priority</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Assignee</th>
                                        <th className="px-4 py-3">Hours</th>
                                        <th className="px-4 py-3">Due Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {client.tasks.map((task) => (
                                        <tr
                                            key={task.id}
                                            onClick={() =>
                                                handleOpenTask(task.id)
                                            }
                                            className="cursor-pointer transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40"
                                        >
                                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                <div>{task.title}</div>
                                                <div className="text-[11px] font-normal text-neutral-400">
                                                    {task.project_name}
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
                                        </tr>
                                    ))}
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

ClientShow.layout = (props: {
    client?: ClientDetail;
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Clients",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/clients`
                : "/clients",
        },
        {
            title: props.client?.name ?? "Client Details",
            href:
                props.currentOrganization && props.client
                    ? `/${props.currentOrganization.slug}/clients/${props.client.id}`
                    : "#",
        },
    ],
});
