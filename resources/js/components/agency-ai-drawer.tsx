import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
    ArrowRight,
    Check,
    Edit3,
    Lightbulb,
    Send,
    Sparkles,
} from 'lucide-react';
import * as React from 'react';

type AgencyAiDrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type AiProposal = {
    id: string;
    headline: string;
    rationale: string;
    confidence: number;
    impact: 'Low' | 'Medium' | 'High';
    sources: string[];
    suggestedAction: string;
    draftState: 'proposed' | 'accepted' | 'edited' | 'dismissed';
};

const SAMPLE_PROMPTS = [
    'What is at risk this week across deliverables?',
    'Review video editor capacity and workload distribution',
    'Generate an executable 2-week social calendar for Acme Corp',
    'Which client projects have scope or margin anomalies?',
];

export function AgencyAiDrawer({ open, onOpenChange }: AgencyAiDrawerProps) {
    const [prompt, setPrompt] = React.useState('');
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [activeProposal, setActiveProposal] =
        React.useState<AiProposal | null>({
            id: 'prop-1',
            headline:
                'Shift 3 Video Reels from Friday to Tuesday due to Editor Overload',
            rationale:
                'Video team capacity is currently booked at 128% on Friday with 2 tight client review cycles. Shifting to Tuesday balances utilization to 84% and respects client approval SLA.',
            confidence: 94,
            impact: 'High',
            sources: [
                'Capacity Matrix',
                'Task Dependencies: Reel-104..106',
                'Client SLAs',
            ],
            suggestedAction:
                'Reschedule 3 deliverables and notify client approver with revised review date',
            draftState: 'proposed',
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setActiveProposal({
                id: `prop-${Date.now()}`,
                headline: `Analysis for: "${prompt.slice(0, 48)}..."`,
                rationale:
                    'Based on current organization workload, task graph dependencies, and remaining hours, recommended rebalancing will mitigate upcoming delivery deadlines.',
                confidence: 89,
                impact: 'Medium',
                sources: [
                    'Current Work Graph',
                    'Calendar Registry',
                    'Team Utilization',
                ],
                suggestedAction:
                    'Apply recommended task prioritization and reassign pending approvals',
                draftState: 'proposed',
            });
            setPrompt('');
        }, 600);
    };

    const handleAction = (status: 'accepted' | 'edited' | 'dismissed') => {
        if (!activeProposal) return;
        setActiveProposal({ ...activeProposal, draftState: status });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 border-l border-neutral-200 p-0 sm:max-w-lg dark:border-neutral-800"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 p-4 dark:border-neutral-800">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400">
                            <Sparkles className="size-4" />
                        </div>
                        <div>
                            <SheetTitle className="text-base leading-tight font-semibold">
                                Agency AI Command Center
                            </SheetTitle>
                            <SheetDescription className="text-xs text-neutral-500 dark:text-neutral-400">
                                AI proposes; authorized team members approve
                                consequential actions
                            </SheetDescription>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {/* Suggested Queries */}
                    <div>
                        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                            <Lightbulb className="size-3.5 text-amber-500" />
                            Suggested Inquiries
                        </div>
                        <div className="grid gap-1.5">
                            {SAMPLE_PROMPTS.map((sample, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setPrompt(sample)}
                                    className="group flex items-center justify-between rounded-md border border-neutral-200/80 bg-neutral-50 p-2 text-left text-xs text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                >
                                    <span className="line-clamp-1">
                                        {sample}
                                    </span>
                                    <ArrowRight className="ml-2 size-3 shrink-0 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active AI Proposal Card */}
                    {activeProposal && (
                        <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="border-indigo-200 bg-indigo-50 text-[10px] font-semibold text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                                        >
                                            AI Proposal
                                        </Badge>
                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            {activeProposal.confidence}%
                                            Confidence
                                        </span>
                                    </div>
                                    <h4 className="text-sm leading-snug font-semibold text-neutral-900 dark:text-neutral-100">
                                        {activeProposal.headline}
                                    </h4>
                                </div>

                                {activeProposal.draftState !== 'proposed' && (
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            'text-xs capitalize',
                                            activeProposal.draftState ===
                                                'accepted' &&
                                                'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
                                            activeProposal.draftState ===
                                                'dismissed' &&
                                                'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
                                        )}
                                    >
                                        {activeProposal.draftState}
                                    </Badge>
                                )}
                            </div>

                            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                                {activeProposal.rationale}
                            </p>

                            <div className="rounded-lg border border-neutral-200/60 bg-neutral-50 p-2.5 text-xs dark:border-neutral-800 dark:bg-neutral-950">
                                <div className="mb-1 font-medium text-neutral-700 dark:text-neutral-300">
                                    Recommended Human Action:
                                </div>
                                <div className="text-neutral-600 dark:text-neutral-400">
                                    {activeProposal.suggestedAction}
                                </div>
                            </div>

                            {/* Source evidence */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] font-medium text-neutral-400">
                                    Evidence Sources:
                                </span>
                                {activeProposal.sources.map((src, i) => (
                                    <span
                                        key={i}
                                        className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                                    >
                                        {src}
                                    </span>
                                ))}
                            </div>

                            {/* Human Authority Controls */}
                            {activeProposal.draftState === 'proposed' && (
                                <div className="flex items-center gap-2 border-t border-neutral-100 pt-2 dark:border-neutral-800">
                                    <Button
                                        size="sm"
                                        className="h-8 flex-1 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                                        onClick={() => handleAction('accepted')}
                                    >
                                        <Check className="mr-1 size-3.5" />
                                        Accept Plan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={() => handleAction('edited')}
                                    >
                                        <Edit3 className="mr-1 size-3.5" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                                        onClick={() =>
                                            handleAction('dismissed')
                                        }
                                    >
                                        Dismiss
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Prompt Input Form */}
                <form
                    onSubmit={handleSubmit}
                    className="border-t border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50"
                >
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Ask Agency AI (e.g. capacity check, schedule proposal)..."
                            className="w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2 pr-10 text-xs placeholder:text-neutral-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-indigo-400"
                            disabled={isAnalyzing}
                        />
                        <button
                            type="submit"
                            disabled={!prompt.trim() || isAnalyzing}
                            className="absolute right-1.5 p-1.5 text-neutral-400 transition-colors hover:text-indigo-600 disabled:opacity-40 dark:hover:text-indigo-400"
                        >
                            <Send className="size-3.5" />
                        </button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
