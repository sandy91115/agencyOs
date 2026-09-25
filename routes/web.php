<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\CapacityController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\Health\LivenessController;
use App\Http\Controllers\Health\ReadinessController;
use App\Http\Controllers\Organizations\OrganizationInvitationController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkController;
use App\Http\Middleware\EnsureOrganizationMembership;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('up', LivenessController::class)->name('health.live');
Route::get('health/ready', ReadinessController::class)->name('health.ready');

Route::prefix('{current_organization}')
    ->middleware(['auth', 'verified', EnsureOrganizationMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('my-work', [WorkController::class, 'index'])->name('work.index');
        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
        Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
        Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');

        Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
        Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
        Route::get('calendar', [CalendarController::class, 'index'])->name('calendar.index');
        Route::get('capacity', [CapacityController::class, 'index'])->name('capacity.index');
        Route::get('departments', [DepartmentController::class, 'index'])->name('departments.index');
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');

        Route::get('tasks/{task}', [TaskController::class, 'show'])->name('tasks.show');
        Route::post('tasks', [TaskController::class, 'store'])->name('tasks.store');
        Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.status.update');
        Route::post('tasks/{task}/checklists', [TaskController::class, 'addChecklist'])->name('tasks.checklists.store');
        Route::post('tasks/{task}/checklists/{checklist}/toggle', [TaskController::class, 'toggleChecklist'])->name('tasks.checklists.toggle');
        Route::post('tasks/{task}/time-logs', [TaskController::class, 'logTime'])->name('tasks.time-logs.store');
        Route::post('tasks/{task}/comments', [TaskController::class, 'addComment'])->name('tasks.comments.store');
    });

Route::middleware(['auth'])->group(function () {
    Route::post('invitations/{invitation}/accept', [OrganizationInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [OrganizationInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';
