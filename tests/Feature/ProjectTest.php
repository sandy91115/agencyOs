<?php

use App\Models\User;
use App\Modules\Client\Models\Client;
use App\Modules\Project\Models\Project;
use App\Modules\Task\Models\Task;
use Inertia\Testing\AssertableInertia as Assert;

test('organization members can view the projects index', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $client = Client::factory()->create([
        'organization_id' => $organization->id,
    ]);

    $project = Project::factory()->create([
        'organization_id' => $organization->id,
        'client_id' => $client->id,
        'name' => 'Q4 Commercial Launch',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('projects.index', [
            'current_organization' => $organization->slug,
        ]));

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('projects/index')
            ->has('projects', 1)
            ->where('projects.0.name', 'Q4 Commercial Launch')
    );
});

test('organization members can view their project workspace with deliverables', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $client = Client::factory()->create([
        'organization_id' => $organization->id,
    ]);

    $project = Project::factory()->create([
        'organization_id' => $organization->id,
        'client_id' => $client->id,
        'name' => 'High-Velocity TikTok Reels Retainer',
        'budget_hours' => 60.0,
        'spent_hours' => 20.0,
        'remaining_hours' => 40.0,
    ]);

    $task = Task::factory()->create([
        'organization_id' => $organization->id,
        'client_id' => $client->id,
        'project_id' => $project->id,
        'title' => 'Cut 3 viral hook variants',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('projects.show', [
            'current_organization' => $organization->slug,
            'project' => $project->id,
        ]));

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('projects/show')
            ->where('project.id', $project->id)
            ->where('project.name', 'High-Velocity TikTok Reels Retainer')
            ->where('project.budget_hours', fn ($val) => (float) $val === 60.0)
            ->has('project.tasks', 1)
            ->where('project.tasks.0.title', 'Cut 3 viral hook variants')
    );
});

test('users cannot view projects belonging to another organization', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherOrganization = $otherUser->personalOrganization();

    $client = Client::factory()->create([
        'organization_id' => $otherOrganization->id,
    ]);

    $project = Project::factory()->create([
        'organization_id' => $otherOrganization->id,
        'client_id' => $client->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('projects.show', [
            'current_organization' => $otherOrganization->slug,
            'project' => $project->id,
        ]));

    $response->assertForbidden();
});

test('organization members can create a new project', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $client = Client::factory()->create([
        'organization_id' => $organization->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('projects.store', [
            'current_organization' => $organization->slug,
        ]), [
            'client_id' => $client->id,
            'name' => 'SEO Content Optimization',
            'description' => 'Targeting high-intent search terms.',
            'billing_type' => 'retainer',
            'budget_hours' => 50,
            'due_date' => now()->addDays(30)->toDateString(),
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('projects', [
        'organization_id' => $organization->id,
        'client_id' => $client->id,
        'name' => 'SEO Content Optimization',
        'budget_hours' => 50.0,
        'remaining_hours' => 50.0,
    ]);
});
