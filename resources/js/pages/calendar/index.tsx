import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { AlertTriangle, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import * as React from "react";

type Props = {
    view?: string;
};

type CalendarPost = {
    id: string;
    day: string;
    date: string;
    client: string;
    platform: "Instagram" | "YouTube" | "TikTok" | "LinkedIn";
    format: "Reel" | "Short" | "Carousel" | "Post";
    pillar: string;
    productionState: "Ready" | "In Editing" | "Approved" | "Changes Requested";
    publishState: "Scheduled" | "Draft" | "Conflict";
    hasConflict?: boolean;
    conflictReason?: string;
};

const SAMPLE_POSTS: CalendarPost[] = [
    {
        id: "post-1",
        day: "Monday",
        date: "Sep 14",
        client: "Acme Corp",
        platform: "YouTube",
        format: "Short",
        pillar: "Product Feature Demo",
        productionState: "Approved",
        publishState: "Scheduled",
    },
    {
        id: "post-2",
        day: "Tuesday",
        date: "Sep 15",
        client: "Apex Retail",
        platform: "Instagram",
        format: "Reel",
        pillar: "Behind the Scenes",
        productionState: "Ready",
        publishState: "Scheduled",
    },
    {
        id: "post-3",
        day: "Wednesday",
        date: "Sep 16",
        client: "Strata FinTech",
        platform: "LinkedIn",
        format: "Carousel",
        pillar: "Industry Analysis",
        productionState: "Approved",
        publishState: "Scheduled",
    },
    {
        id: "post-4",
        day: "Friday",
        date: "Sep 18",
        client: "Apex Retail",
        platform: "TikTok",
        format: "Reel",
        pillar: "Viral Hook Campaign",
        productionState: "In Editing",
        publishState: "Conflict",
        hasConflict: true,
        conflictReason:
            "Video editor workload is at 135% capacity on Friday. Approver turnaround will miss publish cutoff.",
    },
];

export default function CalendarIndex({ view: _view = "week" }: Props) {
    const [selectedConflict, setSelectedConflict] =
        React.useState<CalendarPost | null>(
            SAMPLE_POSTS.find((p) => p.hasConflict) || null,
        );

    return (
        <>
            <Head title="Calendar - AgencyOS" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Production & Social Calendar
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Executable publication schedule verified against
                            production capacity and approval chains
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
                                Sep 14 – Sep 20, 2026
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6"
                            >
                                <ChevronRight className="size-3.5" />
                            </Button>
                        </div>

                        <Button
                            size="sm"
                            className="h-8 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                        >
                            <Plus className="mr-1 size-3.5" />
                            Schedule Deliverable
                        </Button>
                    </div>
                </div>

                {/* Conflict Explanation Banner if any */}
                {selectedConflict && (
                    <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs sm:flex-row sm:items-center dark:border-amber-900/60 dark:bg-amber-950/20">
                        <div className="flex items-center gap-2.5">
                            <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <div>
                                <span className="font-semibold text-amber-900 dark:text-amber-200">
                                    Capacity Conflict Detected (
                                    {selectedConflict.client} ·{" "}
                                    {selectedConflict.format})
                                </span>
                                <p className="mt-0.5 text-amber-800 dark:text-amber-300">
                                    {selectedConflict.conflictReason}
                                </p>
                            </div>
                        </div>

                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 shrink-0 border-amber-300 bg-white text-xs text-amber-800 hover:bg-amber-50 dark:bg-neutral-900 dark:text-amber-200"
                            onClick={() =>
                                alert(
                                    "Proposal: Shift to Tuesday Sep 22 will balance capacity to 84%.",
                                )
                            }
                        >
                            Propose AI Rebalance
                        </Button>
                    </div>
                )}

                {/* Calendar Schedule Grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {SAMPLE_POSTS.map((post) => (
                        <div
                            key={post.id}
                            onClick={() =>
                                post.hasConflict && setSelectedConflict(post)
                            }
                            className={cn(
                                "space-y-3 rounded-xl border bg-white p-4 shadow-xs transition-colors dark:bg-neutral-900",
                                post.hasConflict
                                    ? "border-amber-300 ring-1 ring-amber-400/20 dark:border-amber-800"
                                    : "border-neutral-200 dark:border-neutral-800",
                            )}
                        >
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                                    {post.day}, {post.date}
                                </span>
                                <Badge
                                    variant="outline"
                                    className="border-neutral-200 font-mono text-[10px] dark:border-neutral-800"
                                >
                                    {post.platform}
                                </Badge>
                            </div>

                            <div className="space-y-1">
                                <div className="text-[11px] font-medium text-neutral-400">
                                    {post.client} · {post.format}
                                </div>
                                <h4 className="text-xs leading-snug font-semibold text-neutral-800 dark:text-neutral-200">
                                    {post.pillar}
                                </h4>
                            </div>

                            <div className="flex items-center justify-between border-t border-neutral-100 pt-2 text-[11px] dark:border-neutral-800">
                                <span
                                    className={cn(
                                        "font-medium",
                                        post.productionState === "Approved" &&
                                            "text-emerald-600 dark:text-emerald-400",
                                        post.productionState === "Ready" &&
                                            "text-blue-600 dark:text-blue-400",
                                        post.productionState === "In Editing" &&
                                            "text-amber-600 dark:text-amber-400",
                                    )}
                                >
                                    ● {post.productionState}
                                </span>

                                {post.hasConflict ? (
                                    <span className="flex items-center gap-0.5 font-semibold text-amber-600 dark:text-amber-400">
                                        <AlertTriangle className="size-3" />{" "}
                                        Conflict
                                    </span>
                                ) : (
                                    <span className="font-mono text-neutral-400">
                                        {post.publishState}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

CalendarIndex.layout = (props: {
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Calendar",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/calendar`
                : "/calendar",
        },
    ],
});
