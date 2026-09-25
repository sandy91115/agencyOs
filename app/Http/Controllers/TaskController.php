<?php

namespace App\Http\Controllers;

use App\Modules\Task\Models\Task;
use App\Modules\Task\Models\TaskChecklist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    /**
     * Display the task details.
     */
    public function show(Request $request, string $current_organization, Task $task): Response|JsonResponse
    {
        Gate::authorize('view', $task);

        $task->load([
            'assignedUser:id,name,email',
            'createdByUser:id,name,email',
            'checklists',
            'comments.user:id,name,email',
            'timeLogs.user:id,name,email',
        ]);

        if ($request->wantsJson()) {
            return response()->json(['task' => $task]);
        }

        return Inertia::render('tasks/show', [
            'task' => $task,
        ]);
    }

    /**
     * Update task status.
     */
    public function updateStatus(Request $request, string $current_organization, Task $task): RedirectResponse|JsonResponse
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['todo', 'in_progress', 'review', 'blocked', 'completed'])],
        ]);

        $task->update([
            'status' => $validated['status'],
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'status' => $task->status]);
        }

        return back()->with('success', 'Task status updated.');
    }

    /**
     * Add a checklist item.
     */
    public function addChecklist(Request $request, string $current_organization, Task $task): RedirectResponse|JsonResponse
    {
        Gate::authorize('update', $task);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
        ]);

        $checklist = $task->checklists()->create([
            'title' => $validated['title'],
            'is_completed' => false,
            'sort_order' => $task->checklists()->count(),
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'checklist' => $checklist]);
        }

        return back()->with('success', 'Checklist item added.');
    }

    /**
     * Toggle a checklist item's completion state.
     */
    public function toggleChecklist(Request $request, string $current_organization, Task $task, TaskChecklist $checklist): RedirectResponse|JsonResponse
    {
        Gate::authorize('update', $task);

        if ($checklist->task_id !== $task->id) {
            abort(404);
        }

        $isCompleted = $checklist->toggle();

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'is_completed' => $isCompleted]);
        }

        return back()->with('success', 'Checklist item toggled.');
    }

    /**
     * Log effort hours to the task.
     */
    public function logTime(Request $request, string $current_organization, Task $task): RedirectResponse|JsonResponse
    {
        Gate::authorize('logTime', $task);

        $validated = $request->validate([
            'hours' => ['required', 'numeric', 'min:0.1', 'max:24'],
            'notes' => ['nullable', 'string', 'max:255'],
        ]);

        $timeLog = $task->logTime(
            (float) $validated['hours'],
            $request->user(),
            $validated['notes'] ?? null
        );

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'time_log' => $timeLog,
                'spent_hours' => $task->spent_hours,
                'remaining_hours' => $task->remaining_hours,
            ]);
        }

        return back()->with('success', 'Time logged successfully.');
    }

    /**
     * Add a comment to the task.
     */
    public function addComment(Request $request, string $current_organization, Task $task): RedirectResponse|JsonResponse
    {
        Gate::authorize('comment', $task);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
            'visibility' => ['required', 'string', Rule::in(['internal', 'client'])],
        ]);

        $comment = $task->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
            'visibility' => $validated['visibility'],
        ]);

        $comment->load('user:id,name,email');

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'comment' => $comment]);
        }

        return back()->with('success', 'Comment added.');
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request, string $current_organization): RedirectResponse|JsonResponse
    {
        $organization = $request->user()->currentOrganization;
        abort_if(! $organization, 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'client_id' => ['nullable', 'exists:clients,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'client_name' => ['nullable', 'string', 'max:255'],
            'project_name' => ['nullable', 'string', 'max:255'],
            'brief' => ['nullable', 'string'],
            'priority' => ['required', 'string', Rule::in(['urgent', 'high', 'normal', 'low'])],
            'estimate_hours' => ['required', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
        ]);

        $estimate = (float) $validated['estimate_hours'];

        $task = $organization->tasks()->create([
            'client_id' => $validated['client_id'] ?? null,
            'project_id' => $validated['project_id'] ?? null,
            'client_name' => $validated['client_name'] ?? 'General',
            'project_name' => $validated['project_name'] ?? 'Operations',
            'title' => $validated['title'],
            'brief' => $validated['brief'] ?? null,
            'priority' => $validated['priority'],
            'status' => 'todo',
            'estimate_hours' => $estimate,
            'spent_hours' => 0.0,
            'remaining_hours' => $estimate,
            'start_date' => now()->toDateString(),
            'due_date' => $validated['due_date'] ?? null,
            'assigned_user_id' => $request->user()->id,
            'created_by_user_id' => $request->user()->id,
            'is_client_visible' => false,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'task' => $task]);
        }

        return back()->with('success', 'Task created successfully.');
    }
}
