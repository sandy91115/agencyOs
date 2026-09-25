<?php

namespace App\Http\Controllers;

use App\Modules\Client\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display a listing of clients.
     */
    public function index(Request $request, string $current_organization): Response
    {
        $organization = $request->user()->currentOrganization;

        $clients = $organization ? Client::query()
            ->where('organization_id', $organization->id)
            ->withCount('projects')
            ->with('owner:id,name,email')
            ->orderBy('name')
            ->get() : collect();

        return Inertia::render('clients/index', [
            'filter' => $request->query('filter', 'all'),
            'clients' => $clients,
        ]);
    }

    /**
     * Display the specified client workspace.
     */
    public function show(Request $request, string $current_organization, Client $client): Response|JsonResponse
    {
        Gate::authorize('view', $client);

        $client->load([
            'owner:id,name,email',
            'projects' => function ($query) {
                $query->withCount('tasks')->with('lead:id,name,email')->orderBy('status');
            },
            'tasks' => function ($query) {
                $query->with(['assignedUser:id,name,email', 'checklists'])
                    ->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END")
                    ->orderBy('due_date');
            },
        ]);

        if ($request->wantsJson()) {
            return response()->json(['client' => $client]);
        }

        return Inertia::render('clients/show', [
            'client' => $client,
            'initialTab' => $request->query('tab', 'overview'),
        ]);
    }

    /**
     * Store a newly created client.
     */
    public function store(Request $request, string $current_organization): RedirectResponse
    {
        Gate::authorize('create', Client::class);

        $organization = $request->user()->currentOrganization;
        abort_if(! $organization, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'services' => ['nullable', 'array'],
            'monthly_retainer_cents' => ['nullable', 'integer', 'min:0'],
            'margin_percent' => ['nullable', 'integer', 'min:0', 'max:100'],
            'lead_contact_name' => ['nullable', 'string', 'max:255'],
            'lead_contact_email' => ['nullable', 'email', 'max:255'],
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Client::where('organization_id', $organization->id)->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        $organization->clients()->create([
            'name' => $validated['name'],
            'slug' => $slug,
            'status' => 'active',
            'health' => 'healthy',
            'services' => $validated['services'] ?? [],
            'monthly_retainer_cents' => $validated['monthly_retainer_cents'] ?? 0,
            'margin_percent' => $validated['margin_percent'] ?? 65,
            'lead_contact_name' => $validated['lead_contact_name'] ?? null,
            'lead_contact_email' => $validated['lead_contact_email'] ?? null,
            'owner_user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Client created successfully.');
    }
}
