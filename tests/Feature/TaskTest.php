<?php

use App\Models\User;
use App\Modules\Task\Models\Task;
use App\Modules\Task\Models\TaskChecklist;
use Inertia\Testing\AssertableInertia as Assert;

test('organization members can view a task in their organization', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $task = Task::factory()->create([
        'organization_id' => $organization->id,
        'title' => 'Important Campaign Task',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('tasks.show', [
            'current_organization' => $organization->slug,
            'task' => $task->id,
        ]));

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('tasks/show')
            ->where('task.id', $task->id)
            ->where('task.title', 'Important Campaign Task')
    );
});

test('users cannot view tasks from an organization they do not belong to', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $otherOrganization = $otherUser->personalOrganization();

    $task = Task::factory()->create([
        'organization_id' => $otherOrganization->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('tasks.show', [
            'current_organization' => $otherOrganization->slug,
            'task' => $task->id,
        ]));

    $response->assertForbidden();
});

test('organization members can update task status', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $task = Task::factory()->create([
        'organization_id' => $organization->id,
        'status' => 'todo',
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('tasks.status.update', [
            'current_organization' => $organization->slug,
            'task' => $task->id,
        ]), [
            'status' => 'in_progress',
        ]);

    $response->assertRedirect();
    expect($task->fresh()->status)->toBe('in_progress');
});

test('organization members can add and toggle checklist items', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $task = Task::factory()->create([
        'organization_id' => $organization->id,
    ]);

    // Add checklist item
    $addResponse = $this
        ->actingAs($user)
        ->post(route('tasks.checklists.store', [
            'current_organization' => $organization->slug,
            'task' => $task->id,
        ]), [
            'title' => 'Verify audio balance',
        ]);

    $addResponse->assertRedirect();
    $checklist = TaskChecklist::where('task_id', $task->id)->first();
    expect($checklist)->not->toBeNull();
    expect($checklist->is_completed)->toBeFalse();

    // Toggle checklist item
    $toggleResponse = $this
        ->actingAs($user)
        ->post(route('tasks.checklists.toggle', [
            'current_organization' => $organization->slug,
            'task' => $task->id,
            'checklist' => $checklist->id,
        ]));

    $toggleResponse->assertRedirect();
    expect($checklist->fresh()->is_completed)->toBeTrue();
    expect($checklist->fresh()->completed_at)->not->toBeNull();
});

test('logging time updates spent hours and decrements remaining hours', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $task = Task::factory()->create([
        'organization_id' => $organization->id,
        'estimate_hours' => 10.0,
        'spent_hours' => 2.0,
        'remaining_hours' => 8.0,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('tasks.time-logs.store', [
            'current_organization' => $organization->slug,
            'task' => $task->id,
        ]), [
            'hours' => 3.0,
            'notes' => 'Worked on visual effects pass',
        ]);

    $response->assertRedirect();
    $fresh = $task->fresh();
    expect($fresh->spent_hours)->toEqual(5.0);
    expect($fresh->remaining_hours)->toEqual(5.0);
    expect($task->timeLogs()->count())->toBe(1);
    expect($task->timeLogs()->first()->notes)->toBe('Worked on visual effects pass');
});

test('organization members can add internal and client-visible comments', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $task = Task::factory()->create([
        'organization_id' => $organization->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('tasks.comments.store', [
            'current_organization' => $organization->slug,
            'task' => $task->id,
        ]), [
            'content' => 'Please review the third shot before sign-off.',
            'visibility' => 'client',
        ]);

    $response->assertRedirect();
    expect($task->comments()->count())->toBe(1);
    $comment = $task->comments()->first();
    expect($comment->visibility)->toBe('client');
    expect($comment->content)->toBe('Please review the third shot before sign-off.');
});

test('my-work page lists tasks for the active organization', function () {
    $user = User::factory()->create();
    $organization = $user->personalOrganization();

    $task = Task::factory()->create([
        'organization_id' => $organization->id,
        'title' => 'Assigned User Task',
        'assigned_user_id' => $user->id,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('work.index', [
            'current_organization' => $organization->slug,
        ]));

    $response->assertOk();
    $response->assertInertia(
        fn (Assert $page) => $page
            ->component('my-work')
            ->has('tasks')
    );
});
