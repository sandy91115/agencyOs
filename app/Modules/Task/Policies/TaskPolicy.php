<?php

namespace App\Modules\Task\Policies;

use App\Models\User;
use App\Modules\Task\Models\Task;

class TaskPolicy
{
    /**
     * Determine whether the user can view the task.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->belongsToOrganization($task->organization);
    }

    /**
     * Determine whether the user can update the task.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->belongsToOrganization($task->organization);
    }

    /**
     * Determine whether the user can log time against the task.
     */
    public function logTime(User $user, Task $task): bool
    {
        return $user->belongsToOrganization($task->organization);
    }

    /**
     * Determine whether the user can add comments to the task.
     */
    public function comment(User $user, Task $task): bool
    {
        return $user->belongsToOrganization($task->organization);
    }

    /**
     * Determine whether the user can delete the task.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->belongsToOrganization($task->organization);
    }
}
