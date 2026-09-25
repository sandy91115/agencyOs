<?php

namespace App\Modules\Client\Policies;

use App\Models\User;
use App\Modules\Client\Models\Client;

class ClientPolicy
{
    /**
     * Determine whether the user can view the client.
     */
    public function view(User $user, Client $client): bool
    {
        return $user->belongsToOrganization($client->organization);
    }

    /**
     * Determine whether the user can create clients.
     */
    public function create(User $user): bool
    {
        return $user->currentOrganization !== null;
    }

    /**
     * Determine whether the user can update the client.
     */
    public function update(User $user, Client $client): bool
    {
        return $user->belongsToOrganization($client->organization);
    }

    /**
     * Determine whether the user can delete the client.
     */
    public function delete(User $user, Client $client): bool
    {
        return $user->belongsToOrganization($client->organization);
    }
}
