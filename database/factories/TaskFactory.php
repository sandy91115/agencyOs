<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use App\Modules\Task\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Task>
 */
class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        $estimate = fake()->randomElement([2.0, 4.0, 6.0, 8.0, 12.0]);
        $spent = fake()->randomElement([0.0, 1.5, 3.0]);
        $remaining = max(0.0, $estimate - $spent);

        return [
            'organization_id' => Organization::factory(),
            'client_name' => fake()->company(),
            'project_name' => fake()->words(3, true),
            'title' => fake()->sentence(6),
            'brief' => fake()->paragraphs(2, true),
            'priority' => fake()->randomElement(['urgent', 'high', 'normal']),
            'status' => fake()->randomElement(['todo', 'in_progress', 'review']),
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(rand(1, 14))->toDateString(),
            'estimate_hours' => $estimate,
            'spent_hours' => $spent,
            'remaining_hours' => $remaining,
            'assigned_user_id' => User::factory(),
            'created_by_user_id' => User::factory(),
            'is_client_visible' => fake()->boolean(),
            'dependencies_summary' => null,
        ];
    }
}
