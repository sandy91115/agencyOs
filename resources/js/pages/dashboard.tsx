import PendingInvitationsModal from "@/components/pending-invitations-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboard } from "@/routes";
import type { DashboardInvitation } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    AlertCircle,
    ArrowUpRight,
    BarChart3,
    Clock,
    DollarSign,
    FolderKanban,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";

type Props = {
    pendingInvitations?: DashboardInvitation[];
};

export default function Dashboard({ pendingInvitations = [] }: Props) {
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );
    const page = usePage();
    const orgSlug = page.props.currentOrganization?.slug || "";
    const orgPrefix = orgSlug ? `/${orgSlug}` : "";

    // Sample top KPI metrics adhering to UI/UX brief (4-6 top metrics)
    const metrics = [
        {
            title: "Active Clients",
            value: "18",
            change: "+2 this quarter",
            trend: "up",
            icon: Users,
            href: `${orgPrefix}/clients`,
        },
        {
            title: "Recognized Revenue",
            value: "$124,500",
            change: "+14% vs last month",
            trend: "up",
            icon: DollarSign,
            href: `${orgPrefix}/reports`,
        },
        {
            title: "Target Gross Margin",
            value: "68.4%",
            change: "Above 65% target",
            trend: "up",
            icon: TrendingUp,
            href: `${orgPrefix}/reports`,
        },
        {
            title: "Projects At Risk",
            value: "3",
            change: "2 tight capacity, 1 scope",
            trend: "risk",
            icon: AlertCircle,
            href: `${orgPrefix}/projects`,
        },
        {
            title: "Overdue Deliverables",
            value: "2",
            change: "Both pending client sign-off",
            trend: "risk",
            icon: Clock,
            href: `${orgPrefix}/my-work`,
        },
    ];

    // Risk Queue with explicit reasons and actionable remedies
    const riskQueue = [
        {
            id: "risk-1",
            client: "Apex Retail",
            project: "Q4 Product Launch",
            reason: "Video editor booked at 135% capacity this Friday",
            impact: "Risk of missing Monday broadcast deadline",
            remedy: "Reassign 1 Reel to freelance editor or reschedule to Tuesday",
            severity: "critical",
        },
        {
            id: "risk-2",
            client: "Pulse Health",
            project: "Brand Refresh",
            reason: "Client feedback pending for 7 business days",
            impact: "Dev sprint blocked awaiting approved typography tokens",
            remedy: "Escalate to client account sponsor for sign-off",
            severity: "warning",
        },
        {
            id: "risk-3",
            client: "Strata FinTech",
            project: "SEO Core Migration",
            reason: "Technical redirect scope exceeded estimate by 16 hours",
            impact: "Margin dilution on fixed retainer",
            remedy: "Issue change order or apply hours to next sprint pool",
            severity: "warning",
        },
    ];

    // Department utilization forecast
    const departments = [
        {
            name: "Creative & Design",
            bookedHours: 156,
            totalHours: 180,
            rate: 87,
            status: "healthy",
        },
        {
            name: "Video Production",
            bookedHours: 172,
            totalHours: 160,
            rate: 108,
            status: "overloaded",
        },
        {
            name: "Full-Stack Dev",
            bookedHours: 190,
            totalHours: 200,
            rate: 95,
            status: "optimal",
        },
        {
            name: "SEO & Content",
            bookedHours: 110,
            totalHours: 140,
            rate: 78,
            status: "available",
        },
    ];

    // Pending client approvals
    const pendingApprovals = [
        {
            id: "appr-1",
            client: "Luminary Co.",
            item: "Hero Brand Video v3",
            requestedDate: "Yesterday",
            status: "Awaiting Client Sign-off",
        },
        {
            id: "appr-2",
            client: "Kuro Studio",
            item: "September 12x Social Carousel Batch",
            requestedDate: "2 days ago",
            status: "Internal Review Passed",
        },
    ];

    return (
        <>
            <Head title="Owner Dashboard - AgencyOS" />

            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Top Welcome & Agency AI Quick Bar */}
                <div className="flex flex-col justify-between gap-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-neutral-50 p-4 md:flex-row md:items-center md:p-5 dark:border-indigo-950/80 dark:from-indigo-950/20 dark:via-neutral-900 dark:to-neutral-900/60">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex size-2 rounded-full bg-emerald-500" />
                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                Agency Operations Command
                            </h2>
                        </div>
                        <p className="max-w-2xl text-xs text-neutral-600 dark:text-neutral-400">
                            Deterministic delivery status, live hours-based
                            capacity, and actionable risk management across your
                            client portfolio.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8 border-indigo-200 bg-white text-xs text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:bg-neutral-900 dark:text-indigo-300"
                        >
                            <Link href={`${orgPrefix}/capacity`}>
                                <BarChart3 className="mr-1.5 size-3.5" />
                                Review Capacity
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="h-8 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                        >
                            <Link href={`${orgPrefix}/projects`}>
                                <FolderKanban className="mr-1.5 size-3.5" />
                                Active Projects
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Top Metrics Hierarchy (4-6 top metrics) */}
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
                    {metrics.map((m) => {
                        const Icon = m.icon;
                        const isRisk = m.trend === "risk";

                        return (
                            <Link
                                key={m.title}
                                href={m.href}
                                className={cn(
                                    "group flex flex-col justify-between rounded-xl border bg-white p-4 transition-all hover:shadow-xs dark:bg-neutral-900",
                                    isRisk
                                        ? "border-amber-200/80 hover:border-amber-300 dark:border-amber-900/50"
                                        : "border-neutral-200/80 hover:border-neutral-300 dark:border-neutral-800",
                                )}
                            >
                                <div className="mb-2 flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                                    <span className="text-xs font-medium">
                                        {m.title}
                                    </span>
                                    <Icon
                                        className={cn(
                                            "size-4 transition-transform group-hover:scale-110",
                                            isRisk
                                                ? "text-amber-600 dark:text-amber-400"
                                                : "text-neutral-400",
                                        )}
                                    />
                                </div>
                                <div>
                                    <div
                                        className={cn(
                                            "text-2xl font-bold tracking-tight",
                                            isRisk
                                                ? "text-amber-600 dark:text-amber-400"
                                                : "text-neutral-900 dark:text-neutral-100",
                                        )}
                                    >
                                        {m.value}
                                    </div>
                                    <div className="mt-1 line-clamp-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                                        {m.change}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Main Actionable Grids: Risk Queue & Department Utilization */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Risk Queue (2 columns on wide screen) */}
                    <div className="space-y-3 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    Actionable Risk Queue
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="text-[10px] text-neutral-500"
                                >
                                    3 items
                                </Badge>
                            </div>
                            <span className="text-xs text-neutral-400">
                                Grounded in assignments & dependencies
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {riskQueue.map((item) => (
                                <div
                                    key={item.id}
                                    className="space-y-2.5 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                                {item.client}
                                            </span>
                                            <span className="text-neutral-300 dark:text-neutral-700">
                                                ·
                                            </span>
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                                {item.project}
                                            </span>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[10px] font-semibold tracking-wider uppercase",
                                                item.severity === "critical"
                                                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                                                    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
                                            )}
                                        >
                                            {item.severity}
                                        </Badge>
                                    </div>

                                    <div className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        {item.reason}
                                    </div>

                                    <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2.5 text-xs text-neutral-600 dark:border-neutral-800/80 dark:bg-neutral-950 dark:text-neutral-400">
                                        <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                            Recommended Action:
                                        </span>{" "}
                                        {item.remedy}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Department Utilization & Approvals (1 column on right) */}
                    <div className="space-y-6">
                        {/* Department Utilization */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    Department Utilization
                                </h3>
                                <Link
                                    href={`${orgPrefix}/capacity`}
                                    className="flex items-center gap-0.5 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
                                >
                                    Full matrix{" "}
                                    <ArrowUpRight className="size-3" />
                                </Link>
                            </div>

                            <div className="space-y-3.5 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                                {departments.map((dept) => {
                                    const isOver = dept.rate > 100;

                                    return (
                                        <div
                                            key={dept.name}
                                            className="space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                                    {dept.name}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "font-mono font-semibold",
                                                        isOver
                                                            ? "text-red-600 dark:text-red-400"
                                                            : "text-neutral-600 dark:text-neutral-400",
                                                    )}
                                                >
                                                    {dept.rate}% (
                                                    {dept.bookedHours}h /{" "}
                                                    {dept.totalHours}h)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all",
                                                        isOver
                                                            ? "bg-red-500"
                                                            : dept.rate > 85
                                                              ? "bg-amber-500"
                                                              : "bg-indigo-600 dark:bg-indigo-500",
                                                    )}
                                                    style={{
                                                        width: `${Math.min(100, dept.rate)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    Pending Approvals
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="text-[10px] text-neutral-500"
                                >
                                    {pendingApprovals.length} pending
                                </Badge>
                            </div>

                            <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white shadow-xs dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
                                {pendingApprovals.map((appr) => (
                                    <div
                                        key={appr.id}
                                        className="space-y-1 p-3.5 text-xs"
                                    >
                                        <div className="flex items-center justify-between font-medium text-neutral-900 dark:text-neutral-100">
                                            <span>{appr.client}</span>
                                            <span className="text-[10px] text-neutral-400">
                                                {appr.requestedDate}
                                            </span>
                                        </div>
                                        <div className="text-neutral-600 dark:text-neutral-400">
                                            {appr.item}
                                        </div>
                                        <div className="pt-0.5 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                                            {appr.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: {
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Dashboard",
            href: props.currentOrganization
                ? dashboard(props.currentOrganization.slug)
                : "/",
        },
    ],
});
