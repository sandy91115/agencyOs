<?php

namespace App\Modules\Project\Policies;

use App\Models\User;
use App\Modules\Project\Models\Project;

class ProjectPolicy
{
    /**
     * Determine whether the user can view the project.
     */
    public function view(User $user, Project $project): bool
    {
        return $user->belongsToOrganization($project->organization);
    }

    /**
     * Determine whether the user can create projects.
     */
    public function create(User $user): bool
    {
        return $user->currentOrganization !== null;
    }

    /**
     * Determine whether the user can update the project.
     */
    public function update(User $user, Project $project): bool
    {
        return $user->belongsToOrganization($project->organization);
    }

    /**
     * Determine whether the user can delete the project.
     */
    public function delete(User $user, Project $project): bool
    {
        return $user->belongsToOrganization($project->organization);
    }
}
