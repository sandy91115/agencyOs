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
import { Kanban, LayoutGrid, List, Plus } from "lucide-react";
import * as React from "react";

export type ProjectRecord = {
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
    tasks_count?: number;
    client?: {
        id: number;
        name: string;
        slug: string;
        health?: string;
    };
    lead?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

type Props = {
    view?: string;
    projects?: ProjectRecord[];
    clients?: { id: number; name: string; slug: string }[];
};

export default function ProjectsIndex({
    view = "overview",
    projects = [],
    clients = [],
}: Props) {
    const page = usePage();
    const orgSlug = page.props.currentOrganization?.slug || "";
    const [currentView, setCurrentView] = React.useState(view);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        client_id: clients[0]?.id ? String(clients[0].id) : "",
        description: "",
        billing_type: "retainer",
        budget_hours: "40",
        due_date: "",
    });

    // Update default client_id if clients list loads
    React.useEffect(() => {
        if (!data.client_id && clients.length > 0) {
            setData("client_id", String(clients[0].id));
        }
    }, [clients]);

    const handleCreateProject = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/${orgSlug}/projects`, {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
            },
        });
    };

    const views = [
        { id: "overview", label: "Overview", icon: LayoutGrid },
        { id: "list", label: "List", icon: List },
        { id: "board", label: "Board", icon: Kanban },
    ];

    return (
        <>
            <Head title="Projects - AgencyOS" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Projects & Deliverables
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Multi-discipline delivery, budget burn tracking, and
                            milestone schedules
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* View Mode Toggle */}
                        <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50/50 p-0.5 dark:border-neutral-800 dark:bg-neutral-900">
                            {views.map((v) => {
                                const Icon = v.icon;
                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => setCurrentView(v.id)}
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                                            currentView === v.id
                                                ? "bg-white text-neutral-900 shadow-2xs dark:bg-neutral-800 dark:text-neutral-100"
                                                : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
                                        )}
                                    >
                                        <Icon className="size-3.5" />
                                        <span>{v.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Create Project Modal */}
                        <Dialog
                            open={isCreateOpen}
                            onOpenChange={setIsCreateOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    className="h-8 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                                >
                                    <Plus className="mr-1.5 size-3.5" />
                                    New Project
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>
                                        Create New Project
                                    </DialogTitle>
                                    <DialogDescription>
                                        Set up a project with allocated budget
                                        hours and deliverables.
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleCreateProject}
                                    className="space-y-4"
                                >
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="new-proj-client"
                                            className="text-xs font-medium"
                                        >
                                            Client *
                                        </Label>
                                        <select
                                            id="new-proj-client"
                                            value={data.client_id}
                                            onChange={(e) =>
                                                setData(
                                                    "client_id",
                                                    e.target.value,
                                                )
                                            }
                                            required
                                            className="h-8 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-xs dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                                        >
                                            {clients.map((c) => (
                                                <option
                                                    key={c.id}
                                                    value={String(c.id)}
                                                >
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="new-proj-name"
                                            className="text-xs font-medium"
                                        >
                                            Project Name *
                                        </Label>
                                        <Input
                                            id="new-proj-name"
                                            placeholder="e.g. Q4 Brand Refresh Campaign"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                            className="h-8 text-xs"
                                        />
                                        {errors.name && (
                                            <p className="text-[11px] text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="new-proj-desc"
                                            className="text-xs font-medium"
                                        >
                                            Description
                                        </Label>
                                        <Input
                                            id="new-proj-desc"
                                            placeholder="Campaign scope and milestones..."
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
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
                                                htmlFor="new-proj-budget"
                                                className="text-xs font-medium"
                                            >
                                                Budget Hours *
                                            </Label>
                                            <Input
                                                id="new-proj-budget"
                                                type="number"
                                                step="0.5"
                                                placeholder="60"
                                                value={data.budget_hours}
                                                onChange={(e) =>
                                                    setData(
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
                                                htmlFor="new-proj-date"
                                                className="text-xs font-medium"
                                            >
                                                Target Due Date
                                            </Label>
                                            <Input
                                                id="new-proj-date"
                                                type="date"
                                                value={data.due_date}
                                                onChange={(e) =>
                                                    setData(
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
                                                setIsCreateOpen(false)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={processing}
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

                {/* View 1: Overview Card Grid */}
                {currentView === "overview" && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.length === 0 ? (
                            <div className="col-span-3 py-12 text-center text-xs text-neutral-500">
                                No projects recorded yet. Click "New Project" to
                                start.
                            </div>
                        ) : (
                            projects.map((proj) => {
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
                                        className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs transition-all hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="text-[11px] font-medium text-neutral-400">
                                                        {proj.client?.name ||
                                                            "General"}
                                                    </span>
                                                    <Link
                                                        href={`/${orgSlug}/projects/${proj.id}`}
                                                        className="mt-0.5 block text-sm font-semibold text-neutral-900 hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400"
                                                    >
                                                        {proj.name}
                                                    </Link>
                                                </div>

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

                                            {proj.description && (
                                                <p className="mt-2 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                    {proj.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                                            <div className="flex justify-between text-[11px] text-neutral-500">
                                                <span>Budget Burn</span>
                                                <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
                                                    {proj.spent_hours}h /{" "}
                                                    {proj.budget_hours}h (
                                                    {burnPct}%)
                                                </span>
                                            </div>

                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        burnPct > 90
                                                            ? "bg-red-500"
                                                            : burnPct > 75
                                                              ? "bg-amber-500"
                                                              : "bg-indigo-600",
                                                    )}
                                                    style={{
                                                        width: `${burnPct}%`,
                                                    }}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between text-[11px] text-neutral-400">
                                                <span>
                                                    Lead:{" "}
                                                    {proj.lead?.name ||
                                                        "Unassigned"}
                                                </span>
                                                <span>
                                                    Due:{" "}
                                                    {proj.due_date || "TBD"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* View 2: List View */}
                {currentView === "list" && (
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-neutral-200 bg-neutral-50/70 font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50">
                                <tr>
                                    <th className="px-4 py-3">Project</th>
                                    <th className="px-4 py-3">Client</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Budget Burn</th>
                                    <th className="px-4 py-3">Due Date</th>
                                    <th className="px-4 py-3">Lead</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {projects.map((proj) => (
                                    <tr
                                        key={proj.id}
                                        className="transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            <Link
                                                href={`/${orgSlug}/projects/${proj.id}`}
                                                className="text-neutral-900 hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400"
                                            >
                                                {proj.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            {proj.client?.name || "General"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] capitalize"
                                            >
                                                {proj.status.replace("_", " ")}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 font-mono">
                                            {proj.spent_hours}h /{" "}
                                            {proj.budget_hours}h
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            {proj.due_date || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-500">
                                            {proj.lead?.name || "Unassigned"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* View 3: Board View */}
                {currentView === "board" && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        {(
                            [
                                "planning",
                                "in_progress",
                                "review",
                                "at_risk",
                            ] as const
                        ).map((statusCol) => {
                            const colProjects = projects.filter(
                                (p) => p.status === statusCol,
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
                                            {colProjects.length}
                                        </Badge>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {colProjects.map((p) => (
                                            <Link
                                                key={p.id}
                                                href={`/${orgSlug}/projects/${p.id}`}
                                                className="rounded-lg border border-neutral-200 bg-white p-3 shadow-2xs transition-all hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                                            >
                                                <div className="text-[10px] text-neutral-400">
                                                    {p.client?.name}
                                                </div>
                                                <div className="mt-0.5 text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                                    {p.name}
                                                </div>
                                                <div className="mt-2 flex items-center justify-between text-[10px] text-neutral-500">
                                                    <span>
                                                        {p.spent_hours}h /{" "}
                                                        {p.budget_hours}h
                                                    </span>
                                                    <span>{p.due_date}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

ProjectsIndex.layout = (props: {
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Projects",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/projects`
                : "/projects",
        },
    ],
});
