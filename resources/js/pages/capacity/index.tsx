import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

type Props = {
    timeframe?: string;
};

type MemberCapacity = {
    id: string;
    name: string;
    role: string;
    department: string;
    weeklyCapacityHours: number;
    bookedHours: number;
    days: {
        mon: number;
        tue: number;
        wed: number;
        thu: number;
        fri: number;
    };
};

const SAMPLE_MEMBERS: MemberCapacity[] = [
    {
        id: "mem-1",
        name: "Jordan Hayes",
        role: "Senior Video Editor",
        department: "Video Production",
        weeklyCapacityHours: 35,
        bookedHours: 42,
        days: { mon: 7, tue: 8, wed: 8, thu: 9, fri: 10 },
    },
    {
        id: "mem-2",
        name: "Maya Lin",
        role: "Motion Graphics Designer",
        department: "Creative",
        weeklyCapacityHours: 35,
        bookedHours: 31,
        days: { mon: 6, tue: 6, wed: 7, thu: 6, fri: 6 },
    },
    {
        id: "mem-3",
        name: "Devon Vance",
        role: "Full-Stack Developer",
        department: "Development",
        weeklyCapacityHours: 40,
        bookedHours: 38,
        days: { mon: 8, tue: 8, wed: 8, thu: 7, fri: 7 },
    },
    {
        id: "mem-4",
        name: "Priya Sharma",
        role: "SEO Strategist",
        department: "SEO & Content",
        weeklyCapacityHours: 35,
        bookedHours: 27,
        days: { mon: 5, tue: 5, wed: 6, thu: 6, fri: 5 },
    },
];

export default function CapacityIndex({
    timeframe: _timeframe = "week",
}: Props) {
    const getLoadStyle = (hours: number, maxDaily: number = 8) => {
        const pct = (hours / maxDaily) * 100;
        if (pct > 100)
            return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900 font-bold";
        if (pct >= 85)
            return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900 font-semibold";
        return "bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-800/60 dark:text-neutral-300 dark:border-neutral-700 font-medium";
    };

    return (
        <>
            <Head title="Capacity Planner - AgencyOS" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Capacity & Workload Planner
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Deterministic hours-based team availability vs
                            planned deliverable effort
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1 text-xs dark:border-neutral-800 dark:bg-neutral-900">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                            >
                                <ChevronLeft className="size-3.5" />
                            </Button>
                            <span className="px-2 font-medium">
                                Current Week (40h Base)
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                            >
                                <ChevronRight className="size-3.5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Capacity Planner Heat Grid */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-neutral-200 bg-neutral-50/70 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">
                                        Specialist & Role
                                    </th>
                                    <th className="px-4 py-3 font-semibold">
                                        Department
                                    </th>
                                    <th className="px-3 py-3 text-center font-semibold">
                                        Total Load
                                    </th>
                                    <th className="px-3 py-3 text-center font-semibold">
                                        Mon
                                    </th>
                                    <th className="px-3 py-3 text-center font-semibold">
                                        Tue
                                    </th>
                                    <th className="px-3 py-3 text-center font-semibold">
                                        Wed
                                    </th>
                                    <th className="px-3 py-3 text-center font-semibold">
                                        Thu
                                    </th>
                                    <th className="px-3 py-3 text-center font-semibold">
                                        Fri
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {SAMPLE_MEMBERS.map((member) => {
                                    const loadPct = Math.round(
                                        (member.bookedHours /
                                            member.weeklyCapacityHours) *
                                            100,
                                    );
                                    const isOverloaded = loadPct > 100;

                                    return (
                                        <tr
                                            key={member.id}
                                            className="transition-colors hover:bg-neutral-50/40 dark:hover:bg-neutral-800/30"
                                        >
                                            <td className="px-4 py-3.5 font-medium text-neutral-900 dark:text-neutral-100">
                                                <div>{member.name}</div>
                                                <div className="text-[11px] font-normal text-neutral-400">
                                                    {member.role}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-neutral-600 dark:text-neutral-400">
                                                {member.department}
                                            </td>
                                            <td className="px-3 py-3.5 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span
                                                        className={cn(
                                                            "font-mono text-xs font-bold",
                                                            isOverloaded
                                                                ? "text-red-600 dark:text-red-400"
                                                                : "text-neutral-900 dark:text-neutral-100",
                                                        )}
                                                    >
                                                        {loadPct}%
                                                    </span>
                                                    <span className="font-mono text-[10px] text-neutral-400">
                                                        {member.bookedHours}h /{" "}
                                                        {
                                                            member.weeklyCapacityHours
                                                        }
                                                        h
                                                    </span>
                                                </div>
                                            </td>

                                            {(
                                                [
                                                    "mon",
                                                    "tue",
                                                    "wed",
                                                    "thu",
                                                    "fri",
                                                ] as const
                                            ).map((day) => {
                                                const dayHours =
                                                    member.days[day];
                                                return (
                                                    <td
                                                        key={day}
                                                        className="px-2 py-3.5 text-center"
                                                    >
                                                        <div
                                                            className={cn(
                                                                "inline-block rounded-md border px-2.5 py-1 font-mono text-xs",
                                                                getLoadStyle(
                                                                    dayHours,
                                                                ),
                                                            )}
                                                        >
                                                            {dayHours}h
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Capacity Principle Note */}
                <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
                    <Clock className="mt-0.5 size-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <div>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                            Hours Over Task Count:
                        </span>{" "}
                        Capacity is measured in effective billable hours and
                        complexity, not nominal task tickets. Dragging
                        deliverables in the calendar automatically updates load
                        cells and signals overload before deadlines slip.
                    </div>
                </div>
            </div>
        </>
    );
}

CapacityIndex.layout = (props: {
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Capacity Planner",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/capacity`
                : "/capacity",
        },
    ],
});
