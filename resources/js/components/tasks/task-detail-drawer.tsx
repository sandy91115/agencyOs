import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { TaskDetailContent, type TaskDetailData } from './task-detail-content';

type TaskDetailDrawerProps = {
    task: TaskDetailData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onTaskUpdated?: (updated: TaskDetailData) => void;
};

export function TaskDetailDrawer({
    task,
    open,
    onOpenChange,
    onTaskUpdated,
}: TaskDetailDrawerProps) {
    if (!task) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full overflow-y-auto border-l border-neutral-200 p-6 sm:max-w-2xl lg:max-w-3xl dark:border-neutral-800"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>Task Detail - {task.title}</SheetTitle>
                    <SheetDescription>
                        Inspect and modify task parameters and production state
                    </SheetDescription>
                </SheetHeader>

                <TaskDetailContent task={task} onTaskUpdated={onTaskUpdated} />
            </SheetContent>
        </Sheet>
    );
}
