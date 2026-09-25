<?php

use App\Models\User;
use App\Modules\Client\Models\Client;
use App\Modules\Project\Models\Project;
use App\Modules\Task\Models\Task;
use Inertia\Testing\AssertableInertia as Assert;

test('organization members can view the clients index', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $client = Client::factory()->create([
        'organization_id' => $organization->id,
        'name' => 'Acme Corporation',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('clients.index', [
            'current_organization' => $organization->slug,
        ]));

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('clients/index')
            ->has('clients', 1)
            ->where('clients.0.name', 'Acme Corporation')
    );
});

test('organization members can view their client workspace', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $client = Client::factory()->create([
        'organization_id' => $organization->id,
        'name' => 'Pulse Health',
    ]);

    $project = Project::factory()->create([
        'organization_id' => $organization->id,
        'client_id' => $client->id,
        'name' => 'Brand System Overhaul',
    ]);

    $task = Task::factory()->create([
        'organization_id' => $organization->id,
        'client_id' => $client->id,
        'project_id' => $project->id,
        'title' => 'Deliver Design Tokens',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('clients.show', [
            'current_organization' => $organization->slug,
            'client' => $client->id,
        ]));

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('clients/show')
            ->where('client.id', $client->id)
            ->where('client.name', 'Pulse Health')
            ->has('client.projects', 1)
            ->has('client.tasks', 1)
    );
});

test('users cannot view clients belonging to another organization', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherOrganization = $otherUser->personalOrganization();

    $client = Client::factory()->create([
        'organization_id' => $otherOrganization->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('clients.show', [
            'current_organization' => $otherOrganization->slug,
            'client' => $client->id,
        ]));

    $response->assertForbidden();
});

test('organization members can create a new client', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $response = $this
        ->actingAs($user)
        ->post(route('clients.store', [
            'current_organization' => $organization->slug,
        ]), [
            'name' => 'Nexus Media',
            'services' => ['Creative', 'Paid Social'],
            'monthly_retainer_cents' => 1200000,
            'margin_percent' => 68,
            'lead_contact_name' => 'Alex Rivera',
            'lead_contact_email' => 'alex@nexusmedia.com',
        ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('clients', [
        'organization_id' => $organization->id,
        'name' => 'Nexus Media',
        'margin_percent' => 68,
        'lead_contact_name' => 'Alex Rivera',
    ]);
});
