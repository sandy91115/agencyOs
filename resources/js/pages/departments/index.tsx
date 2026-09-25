import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { Code2, Megaphone, Palette, Plus, Video } from "lucide-react";
import * as React from "react";

type Props = {
    selected?: string;
};

type DepartmentInfo = {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    lead: string;
    membersCount: number;
    weeklyCapacityHours: number;
    bookedHours: number;
    utilization: number;
    openDeliverables: number;
};

const SAMPLE_DEPARTMENTS: DepartmentInfo[] = [
    {
        id: "creative",
        name: "Creative & Visual Design",
        icon: Palette,
        lead: "Maya Lin",
        membersCount: 5,
        weeklyCapacityHours: 175,
        bookedHours: 152,
        utilization: 87,
        openDeliverables: 14,
    },
    {
        id: "video",
        name: "Video & Motion Production",
        icon: Video,
        lead: "Jordan Hayes",
        membersCount: 4,
        weeklyCapacityHours: 140,
        bookedHours: 151,
        utilization: 108,
        openDeliverables: 18,
    },
    {
        id: "development",
        name: "Full-Stack Engineering",
        icon: Code2,
        lead: "Devon Vance",
        membersCount: 6,
        weeklyCapacityHours: 240,
        bookedHours: 228,
        utilization: 95,
        openDeliverables: 9,
    },
    {
        id: "seo-content",
        name: "SEO & Editorial Content",
        icon: Megaphone,
        lead: "Priya Sharma",
        membersCount: 4,
        weeklyCapacityHours: 140,
        bookedHours: 110,
        utilization: 78,
        openDeliverables: 12,
    },
];

export default function DepartmentsIndex({
    selected: _selected = "all",
}: Props) {
    return (
        <>
            <Head title="Departments - AgencyOS" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Departments & Cross-Functional Teams
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Departmental workload, staffing allocation, and
                            delivery velocity
                        </p>
                    </div>

                    <Button
                        size="sm"
                        className="h-8 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                    >
                        <Plus className="mr-1 size-3.5" />
                        Configure Department
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {SAMPLE_DEPARTMENTS.map((dept) => {
                        const Icon = dept.icon;
                        const isOver = dept.utilization > 100;

                        return (
                            <div
                                key={dept.id}
                                className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                            <Icon className="size-4.5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                                {dept.name}
                                            </h3>
                                            <div className="text-xs text-neutral-400">
                                                Lead: {dept.lead} ·{" "}
                                                {dept.membersCount} specialists
                                            </div>
                                        </div>
                                    </div>

                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "font-mono text-[10px] font-semibold",
                                            isOver
                                                ? "border-red-200 bg-red-50 text-red-600 dark:bg-red-950/40"
                                                : dept.utilization > 85
                                                  ? "border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/40"
                                                  : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40",
                                        )}
                                    >
                                        {dept.utilization}% Load
                                    </Badge>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between font-mono text-xs text-neutral-500">
                                        <span>Allocated Hours vs Capacity</span>
                                        <span>
                                            {dept.bookedHours}h /{" "}
                                            {dept.weeklyCapacityHours}h
                                        </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                                        <div
                                            className={cn(
                                                "h-full rounded-full",
                                                isOver
                                                    ? "bg-red-500"
                                                    : dept.utilization > 85
                                                      ? "bg-amber-500"
                                                      : "bg-indigo-600 dark:bg-indigo-500",
                                            )}
                                            style={{
                                                width: `${Math.min(100, dept.utilization)}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-neutral-100 pt-1 text-xs text-neutral-500 dark:border-neutral-800">
                                    <span>
                                        {dept.openDeliverables} open
                                        deliverables
                                    </span>
                                    <span className="cursor-pointer font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                                        View Team & Skills →
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

DepartmentsIndex.layout = (props: {
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Departments",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/departments`
                : "/departments",
        },
    ],
});
