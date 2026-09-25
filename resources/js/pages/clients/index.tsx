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
import { Plus, Search } from "lucide-react";
import * as React from "react";

export type ClientRecord = {
    id: number;
    organization_id: number;
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
    projects_count?: number;
    owner?: {
        id: number;
        name: string;
        email: string;
    } | null;
};

type Props = {
    filter?: string;
    clients?: ClientRecord[];
};

export default function ClientsIndex({ filter = "all", clients = [] }: Props) {
    const page = usePage();
    const orgSlug = page.props.currentOrganization?.slug || "";
    const [search, setSearch] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState(filter);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);

    const { data, setData, processing, reset, errors } = useForm({
        name: "",
        services: "",
        monthly_retainer: "",
        margin_percent: "65",
        lead_contact_name: "",
        lead_contact_email: "",
    });

    const handleCreateClient = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            `/${orgSlug}/clients`,
            {
                name: data.name,
                services: data.services
                    ? data.services.split(",").map((s) => s.trim())
                    : [],
                monthly_retainer_cents: data.monthly_retainer
                    ? Math.round(parseFloat(data.monthly_retainer) * 100)
                    : 0,
                margin_percent: parseInt(data.margin_percent, 10) || 65,
                lead_contact_name: data.lead_contact_name,
                lead_contact_email: data.lead_contact_email,
            },
            {
                onSuccess: () => {
                    setIsCreateOpen(false);
                    reset();
                },
            },
        );
    };

    const filteredClients = clients.filter((client) => {
        const matchesSearch = client.name
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "at_risk" && client.health !== "healthy") ||
            client.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(cents / 100);
    };

    return (
        <>
            <Head title="Clients - AgencyOS" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Header & Primary Actions */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                            Client Portfolio
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Active retainers, delivery health, service lines,
                            and recognized margins
                        </p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button
                                size="sm"
                                className="h-8 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                            >
                                <Plus className="mr-1.5 size-3.5" />
                                Add Client
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add New Client</DialogTitle>
                                <DialogDescription>
                                    Create a client workspace to track projects,
                                    production retainers, and margin health.
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                onSubmit={handleCreateClient}
                                className="space-y-4"
                            >
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="client-name"
                                        className="text-xs font-medium"
                                    >
                                        Client Name *
                                    </Label>
                                    <Input
                                        id="client-name"
                                        placeholder="e.g. Acme Corporation"
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
                                        htmlFor="client-services"
                                        className="text-xs font-medium"
                                    >
                                        Service Lines (comma-separated)
                                    </Label>
                                    <Input
                                        id="client-services"
                                        placeholder="e.g. Video Production, Creative, SEO"
                                        value={data.services}
                                        onChange={(e) =>
                                            setData("services", e.target.value)
                                        }
                                        className="h-8 text-xs"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="client-retainer"
                                            className="text-xs font-medium"
                                        >
                                            Monthly Retainer ($)
                                        </Label>
                                        <Input
                                            id="client-retainer"
                                            type="number"
                                            placeholder="15000"
                                            value={data.monthly_retainer}
                                            onChange={(e) =>
                                                setData(
                                                    "monthly_retainer",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="client-margin"
                                            className="text-xs font-medium"
                                        >
                                            Target Margin (%)
                                        </Label>
                                        <Input
                                            id="client-margin"
                                            type="number"
                                            placeholder="65"
                                            value={data.margin_percent}
                                            onChange={(e) =>
                                                setData(
                                                    "margin_percent",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="client-lead-name"
                                            className="text-xs font-medium"
                                        >
                                            Primary Contact
                                        </Label>
                                        <Input
                                            id="client-lead-name"
                                            placeholder="Sarah Jenkins"
                                            value={data.lead_contact_name}
                                            onChange={(e) =>
                                                setData(
                                                    "lead_contact_name",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="client-lead-email"
                                            className="text-xs font-medium"
                                        >
                                            Contact Email
                                        </Label>
                                        <Input
                                            id="client-lead-email"
                                            type="email"
                                            placeholder="sarah@acme.com"
                                            value={data.lead_contact_email}
                                            onChange={(e) =>
                                                setData(
                                                    "lead_contact_email",
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
                                        onClick={() => setIsCreateOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={processing}
                                        className="bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        Create Client
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-2.5 left-2.5 size-3.5 text-neutral-400" />
                        <Input
                            placeholder="Filter by client name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-8 border-neutral-200 bg-white pl-8 text-xs dark:border-neutral-800 dark:bg-neutral-900"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 self-start overflow-x-auto sm:self-auto">
                        {["all", "active", "at_risk"].map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setStatusFilter(f)}
                                className={cn(
                                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                                    statusFilter === f
                                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400",
                                )}
                            >
                                {f.replace("_", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clients Table */}
                <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-neutral-200 bg-neutral-50/70 font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/50">
                                <tr>
                                    <th className="px-4 py-3">Client Name</th>
                                    <th className="px-4 py-3">
                                        Health & Delivery
                                    </th>
                                    <th className="px-4 py-3">
                                        Active Services
                                    </th>
                                    <th className="px-4 py-3">Projects</th>
                                    <th className="px-4 py-3">
                                        Monthly Retainer
                                    </th>
                                    <th className="px-4 py-3">Margin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {filteredClients.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-xs text-neutral-500"
                                        >
                                            No clients found matching the
                                            criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredClients.map((client) => (
                                        <tr
                                            key={client.id}
                                            className="group transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40"
                                        >
                                            <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">
                                                <Link
                                                    href={`/${orgSlug}/clients/${client.id}`}
                                                    className="font-semibold text-neutral-900 hover:text-indigo-600 dark:text-neutral-100 dark:hover:text-indigo-400"
                                                >
                                                    {client.name}
                                                </Link>
                                                <div className="text-[11px] font-normal text-neutral-400">
                                                    Lead:{" "}
                                                    {client.lead_contact_name ||
                                                        client.owner?.name ||
                                                        "Unassigned"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[10px] font-semibold capitalize",
                                                        client.health ===
                                                            "healthy" &&
                                                            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
                                                        client.health ===
                                                            "at_risk" &&
                                                            "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
                                                        client.health ===
                                                            "critical" &&
                                                            "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
                                                    )}
                                                >
                                                    {client.health.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {(
                                                        client.services || []
                                                    ).map((s, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                                                        >
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono font-medium">
                                                <Link
                                                    href={`/${orgSlug}/clients/${client.id}?tab=projects`}
                                                    className="hover:underline"
                                                >
                                                    {client.projects_count ?? 0}{" "}
                                                    active
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 font-mono font-medium text-neutral-900 dark:text-neutral-100">
                                                {formatCurrency(
                                                    client.monthly_retainer_cents,
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                {client.margin_percent}%
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

ClientsIndex.layout = (props: {
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "Clients",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/clients`
                : "/clients",
        },
    ],
});
