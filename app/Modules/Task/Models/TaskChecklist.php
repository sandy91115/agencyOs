<?php

namespace App\Modules\Task\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $task_id
 * @property string $title
 * @property bool $is_completed
 * @property CarbonImmutable|null $completed_at
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Task $task
 */
class TaskChecklist extends Model
{
    protected $fillable = [
        'task_id',
        'title',
        'is_completed',
        'completed_at',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_completed' => 'boolean',
            'completed_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Task, $this>
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * Toggle completion state.
     */
    public function toggle(): bool
    {
        $this->is_completed = ! $this->is_completed;
        $this->completed_at = $this->is_completed ? now() : null;
        $this->save();

        return $this->is_completed;
    }
}
