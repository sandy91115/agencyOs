import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { BookOpen, Keyboard, LifeBuoy } from 'lucide-react';

type HelpModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
    const shortcuts = [
        { label: 'Search & Command Palette', key: '⌘ + K' },
        { label: 'Ask Agency AI Command', key: '⌘ + J' },
        { label: 'Settings & Preferences', key: '⌘ + ,' },
        { label: 'Close Dialog / Esc', key: 'ESC' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-6">
                <DialogHeader>
                    <div className="mb-1 flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                            <LifeBuoy className="size-4" />
                        </div>
                        <DialogTitle className="text-base font-semibold">
                            Help & Resources
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-neutral-500">
                        Operational guide and system shortcuts for AgencyOS
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Shortcuts */}
                    <div>
                        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                            <Keyboard className="size-3.5" />
                            Keyboard Shortcuts
                        </div>
                        <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 text-xs dark:divide-neutral-800 dark:border-neutral-800">
                            {shortcuts.map((s, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between px-3 py-2"
                                >
                                    <span className="text-neutral-700 dark:text-neutral-300">
                                        {s.label}
                                    </span>
                                    <kbd className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">
                                        {s.key}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Operational Principles */}
                    <div className="space-y-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50 p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                        <div className="flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-200">
                            <BookOpen className="size-3.5 text-indigo-600" />
                            Core Principle
                        </div>
                        <p className="leading-relaxed">
                            Every schedule in AgencyOS is verified against real
                            team capacity and approval chains. AI proposes;
                            authorized team members make consequential
                            decisions.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
