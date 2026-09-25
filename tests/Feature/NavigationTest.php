<?php

use App\Models\Organization;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login when visiting workspace routes', function (string $route) {
    $organization = Organization::factory()->create();

    $response = $this->get(route($route, ['current_organization' => $organization->slug]));

    $response->assertRedirect(route('login'));
})->with([
    'dashboard',
    'work.index',
    'clients.index',
    'projects.index',
    'calendar.index',
    'capacity.index',
    'departments.index',
    'reports.index',
]);

test('authenticated organization members can access all workspace routes', function (string $route, string $component) {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $response = $this
        ->actingAs($user)
        ->get(route($route, ['current_organization' => $organization->slug]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['dashboard', 'dashboard'],
    ['work.index', 'my-work'],
    ['clients.index', 'clients/index'],
    ['projects.index', 'projects/index'],
    ['calendar.index', 'calendar/index'],
    ['capacity.index', 'capacity/index'],
    ['departments.index', 'departments/index'],
    ['reports.index', 'reports/index'],
]);

test('users cannot access workspaces of organizations they do not belong to', function () {
    $user = User::factory()->create();
    $otherOrganization = Organization::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('work.index', ['current_organization' => $otherOrganization->slug]));

    $response->assertForbidden();
});
