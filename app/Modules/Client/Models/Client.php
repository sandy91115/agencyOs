<?php

namespace App\Modules\Client\Models;

use App\Models\Organization;
use App\Models\User;
use App\Modules\Project\Models\Project;
use App\Modules\Task\Models\Task;
use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $organization_id
 * @property string $name
 * @property string $slug
 * @property string $status
 * @property string $health
 * @property string|null $health_reason
 * @property array<string>|null $services
 * @property int $monthly_retainer_cents
 * @property int $margin_percent
 * @property string|null $lead_contact_name
 * @property string|null $lead_contact_email
 * @property int|null $owner_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Organization $organization
 * @property-read User|null $owner
 * @property-read Collection<int, Project> $projects
 * @property-read Collection<int, Task> $tasks
 */
class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;

    protected static function newFactory(): ClientFactory
    {
        return ClientFactory::new();
    }

    protected $fillable = [
        'organization_id',
        'name',
        'slug',
        'status',
        'health',
        'health_reason',
        'services',
        'monthly_retainer_cents',
        'margin_percent',
        'lead_contact_name',
        'lead_contact_email',
        'owner_user_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'services' => 'array',
            'monthly_retainer_cents' => 'integer',
            'margin_percent' => 'integer',
            'owner_user_id' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Organization, $this>
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    /**
     * @return HasMany<Project, $this>
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * @return HasMany<Task, $this>
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Scope query to the given organization.
     *
     * @param  Builder<Client>  $query
     * @return Builder<Client>
     */
    public function scopeForOrganization(Builder $query, int $organizationId): Builder
    {
        return $query->where('organization_id', $organizationId);
    }
}
