import {
    TaskDetailContent,
    type TaskDetailData,
} from "@/components/tasks/task-detail-content";
import { Head } from "@inertiajs/react";

type Props = {
    task: TaskDetailData;
};

export default function TaskShow({ task }: Props) {
    return (
        <>
            <Head title={`${task.title} - AgencyOS`} />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6">
                <TaskDetailContent task={task} />
            </div>
        </>
    );
}

TaskShow.layout = (props: {
    task?: TaskDetailData;
    currentOrganization?: { slug: string } | null;
}) => ({
    breadcrumbs: [
        {
            title: "My Work",
            href: props.currentOrganization
                ? `/${props.currentOrganization.slug}/my-work`
                : "/my-work",
        },
        {
            title: props.task ? `Task #${props.task.id}` : "Task Details",
            href:
                props.currentOrganization && props.task
                    ? `/${props.currentOrganization.slug}/tasks/${props.task.id}`
                    : "#",
        },
    ],
});
