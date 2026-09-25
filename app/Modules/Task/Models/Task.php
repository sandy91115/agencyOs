<?php

namespace App\Modules\Task\Models;

use App\Models\Organization;
use App\Models\User;
use App\Modules\Client\Models\Client;
use App\Modules\Project\Models\Project;
use Database\Factories\TaskFactory;
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
 * @property int|null $client_id
 * @property int|null $project_id
 * @property string $client_name
 * @property string $project_name
 * @property string $title
 * @property string|null $brief
 * @property string $priority
 * @property string $status
 * @property Carbon|null $start_date
 * @property Carbon|null $due_date
 * @property float $estimate_hours
 * @property float $spent_hours
 * @property float $remaining_hours
 * @property int|null $assigned_user_id
 * @property int|null $created_by_user_id
 * @property bool $is_client_visible
 * @property string|null $dependencies_summary
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Organization $organization
 * @property-read Client|null $client
 * @property-read Project|null $project
 * @property-read User|null $assignedUser
 * @property-read User|null $createdByUser
 * @property-read Collection<int, TaskChecklist> $checklists
 * @property-read Collection<int, TaskComment> $comments
 * @property-read Collection<int, TaskTimeLog> $timeLogs
 */
class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory(): TaskFactory
    {
        return TaskFactory::new();
    }

    protected $fillable = [
        'organization_id',
        'client_id',
        'project_id',
        'client_name',
        'project_name',
        'title',
        'brief',
        'priority',
        'status',
        'start_date',
        'due_date',
        'estimate_hours',
        'spent_hours',
        'remaining_hours',
        'assigned_user_id',
        'created_by_user_id',
        'is_client_visible',
        'dependencies_summary',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'due_date' => 'date',
            'estimate_hours' => 'float',
            'spent_hours' => 'float',
            'remaining_hours' => 'float',
            'is_client_visible' => 'boolean',
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
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    /**
     * @return HasMany<TaskChecklist, $this>
     */
    public function checklists(): HasMany
    {
        return $this->hasMany(TaskChecklist::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<TaskComment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class)->latest();
    }

    /**
     * @return HasMany<TaskTimeLog, $this>
     */
    public function timeLogs(): HasMany
    {
        return $this->hasMany(TaskTimeLog::class)->latest('logged_at');
    }

    /**
     * Scope query to a specific organization.
     *
     * @param  Builder<$this>  $query
     */
    public function scopeForOrganization(Builder $query, int $organizationId): void
    {
        $query->where('organization_id', $organizationId);
    }

    /**
     * Log effort hours and decrement remaining hours.
     */
    public function logTime(float $hours, User $user, ?string $notes = null): TaskTimeLog
    {
        $timeLog = $this->timeLogs()->create([
            'user_id' => $user->id,
            'hours' => $hours,
            'notes' => $notes,
            'logged_at' => now(),
        ]);

        $this->spent_hours += $hours;
        $this->remaining_hours = max(0.0, (float) $this->remaining_hours - $hours);
        $this->save();

        return $timeLog;
    }
}
