<?php

namespace App\Http\Controllers;

use App\Modules\Client\Models\Client;
use App\Modules\Project\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(Request $request, string $current_organization): Response
    {
        $organization = $request->user()->currentOrganization;

        $projects = $organization ? Project::query()
            ->where('organization_id', $organization->id)
            ->with([
                'client:id,name,slug,health',
                'lead:id,name,email',
            ])
            ->withCount('tasks')
            ->orderBy('due_date')
            ->get() : collect();

        $clients = $organization ? Client::query()
            ->where('organization_id', $organization->id)
            ->select(['id', 'name', 'slug'])
            ->orderBy('name')
            ->get() : collect();

        return Inertia::render('projects/index', [
            'view' => $request->query('view', 'overview'),
            'projects' => $projects,
            'clients' => $clients,
        ]);
    }

    /**
     * Display the specified project workspace.
     */
    public function show(Request $request, string $current_organization, Project $project): Response|JsonResponse
    {
        Gate::authorize('view', $project);

        $project->load([
            'client:id,name,slug,health,health_reason',
            'lead:id,name,email',
            'tasks' => function ($query) {
                $query->with([
                    'assignedUser:id,name,email',
                    'checklists',
                    'comments.user:id,name,email',
                    'timeLogs.user:id,name,email',
                ])
                    ->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END")
                    ->orderBy('due_date');
            },
        ]);

        if ($request->wantsJson()) {
            return response()->json(['project' => $project]);
        }

        return Inertia::render('projects/show', [
            'project' => $project,
            'initialView' => $request->query('view', 'overview'),
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request, string $current_organization): RedirectResponse
    {
        Gate::authorize('create', Project::class);

        $organization = $request->user()->currentOrganization;
        abort_if(! $organization, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'client_id' => [
                'required',
                Rule::exists('clients', 'id')->where(fn ($query) => $query->where('organization_id', $organization->id)),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'billing_type' => ['required', 'string', Rule::in(['retainer', 'fixed', 'time_and_materials'])],
            'budget_hours' => ['required', 'numeric', 'min:0'],
            'budget_cents' => ['nullable', 'integer', 'min:0'],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Project::where('organization_id', $organization->id)->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $budgetHours = (float) $validated['budget_hours'];

        $organization->projects()->create([
            'client_id' => (int) $validated['client_id'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'status' => 'in_progress',
            'health' => 'on_track',
            'billing_type' => $validated['billing_type'],
            'budget_hours' => $budgetHours,
            'spent_hours' => 0.0,
            'remaining_hours' => $budgetHours,
            'budget_cents' => $validated['budget_cents'] ?? (int) ($budgetHours * 15000),
            'start_date' => $validated['start_date'] ?? now()->toDateString(),
            'due_date' => $validated['due_date'] ?? null,
            'lead_user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Project created successfully.');
    }
}
