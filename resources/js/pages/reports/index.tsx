import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { Download } from "lucide-react";

type Props = {
    type?: string;
};

export default function ReportsIndex({ type: _type = "overview" }: Props) {
    const reportCards = [
        {
            title: "Realized Hourly Rate",
            value: "$148/hr",
            target: "$135/hr target",
            change: "+9.6%",
            positive: true,
            summary:
                "Average effective billable realization across fixed retainers and T&M projects.",
        },
        {
            title: "On-Time Client Delivery",
            value: "92.4%",
            target: "90.0% benchmark",
            change: "+3.1%",
            positive: true,
            summary:
                "Deliverables passed through final human sign-off prior to scheduled publication cutoffs.",
        },
        {
            title: "Average Approval Turnaround",
            value: "1.4 days",
            target: "2.0 days SLA",
            change: "-0.6 days",
            positive: true,
            summary:
                "Duration between internal review submission and client sign-off.",
        },
        {
            title: "Billable Team Utilization",
            value: "84.8%",
            target: "80-85% optimal",
            change: "Optimal",
            positive: true,
            summary:
                "Ratio of billable client effort hours to total available specialist capacity.",
        },
    ];

    const clientMargins = [
        {
            client: "Strata FinTech",
            revenue: "$22,000",
            cost: "$5,280",
            margin: "76%",
            status: "high",
        },
        {
            client: "Acme Corp",
            revenue: "$18,500",
            cost: "$5,365",
            margin: "71%",
            status: "healthy",
        },
        {
            client: "Luminary Co.",
            revenue: "$9,500",
            cost: "$3,040",
            margin: "68%",
            status: "healthy",
        },
        {
            client: "Pulse Health",
            revenue: "$14,500",
            cost: "$5,510",
            margin: "62%",
            status: "moderate",
        },
        {
            client: "Apex Retail Group",
            revenue: "$12,000",
            cost: "$5,520",
            margin: "54%",
            status: "low",
        },
    ];

    return (
        <>
            <Head title="Reports - AgencyOS" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Delivery Intelligence & Profitability
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Derived from logged hours, deliverable velocity, and
                            actual production cost
                        </p>
                    </div>

                    <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Download className="mr-1.5 size-3.5" />
                        Export Audit CSV
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {reportCards.map((card) => (
                        <div
                            key={card.title}
                            className="space-y-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                {card.title}
                            </span>
                            <div className="flex items-baseline justify-between">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                                    {card.value}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="bg-emerald-50 text-[10px] text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                >
                                    {card.change}
                                </Badge>
                            </div>
                            <p className="line-clamp-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                                {card.summary}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Client Profitability Table */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        Client Retainer Margin Breakdown
                    </h3>

                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="border-b border-neutral-200 bg-neutral-50/70 font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50">
                                    <tr>
                                        <th className="px-4 py-3">Client</th>
                                        <th className="px-4 py-3">
                                            Recognized Monthly Revenue
                                        </th>
                                        <th className="px-4 py-3">
                                            Production Internal Cost
                                        </th>
                                        <th className="px-4 py-3">
                                            Gross Margin
                                        </th>
                                        <th className="px-4 py-3">
                                            Health Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                    {clientMargins.map((item) => (
                                        <tr
                                            key={item.client}
                                            className="hover:bg-neutral-50/40 dark:hover:bg-neutral-800/30"
                                        >
                                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                {item.client}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-medium">
                                                {item.revenue}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-neutral-500">
                                                {item.cost}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                                                {item.margin}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px] font-semibold capitalize",
                                                        item.status ===
                                                            "high" &&
                                                            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
                                                        item.status ===
                                                            "healthy" &&
                                                            "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400",
                                                        item.status ===
                                                            "moderate" &&
                                                            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
                                                        item.status === "low" &&
                                                            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                                                    )}
                                                >
                                                    {item.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ReportsIndex.layout = (props: {
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Reports & Profitability",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/reports`
                : "/reports",
        },
    ],
});
