<?php

namespace App\Modules\Project\Models;

use App\Models\Organization;
use App\Models\User;
use App\Modules\Client\Models\Client;
use App\Modules\Task\Models\Task;
use Database\Factories\ProjectFactory;
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
 * @property int $client_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property string $status
 * @property string $health
 * @property string|null $health_reason
 * @property string $billing_type
 * @property float $budget_hours
 * @property float $spent_hours
 * @property float $remaining_hours
 * @property int $budget_cents
 * @property Carbon|null $start_date
 * @property Carbon|null $due_date
 * @property int|null $lead_user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Organization $organization
 * @property-read Client $client
 * @property-read User|null $lead
 * @property-read Collection<int, Task> $tasks
 */
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    protected static function newFactory(): ProjectFactory
    {
        return ProjectFactory::new();
    }

    protected $fillable = [
        'organization_id',
        'client_id',
        'name',
        'slug',
        'description',
        'status',
        'health',
        'health_reason',
        'billing_type',
        'budget_hours',
        'spent_hours',
        'remaining_hours',
        'budget_cents',
        'start_date',
        'due_date',
        'lead_user_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'budget_hours' => 'float',
            'spent_hours' => 'float',
            'remaining_hours' => 'float',
            'budget_cents' => 'integer',
            'start_date' => 'date',
            'due_date' => 'date',
            'lead_user_id' => 'integer',
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
     * @return BelongsTo<Client, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function lead(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lead_user_id');
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
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    public function scopeForOrganization(Builder $query, int $organizationId): Builder
    {
        return $query->where('organization_id', $organizationId);
    }
}
