<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use App\Modules\Client\Models\Client;
use App\Modules\Project\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        $name = fake()->sentence(3);
        $budget = fake()->randomElement([40.0, 80.0, 120.0, 160.0]);
        $spent = fake()->randomElement([10.0, 25.0, 50.0]);
        $remaining = max(0.0, $budget - $spent);

        return [
            'organization_id' => Organization::factory(),
            'client_id' => Client::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['planning', 'in_progress', 'review', 'at_risk']),
            'health' => fake()->randomElement(['on_track', 'at_risk', 'critical']),
            'health_reason' => null,
            'billing_type' => fake()->randomElement(['retainer', 'fixed', 'time_and_materials']),
            'budget_hours' => $budget,
            'spent_hours' => $spent,
            'remaining_hours' => $remaining,
            'budget_cents' => (int) ($budget * 15000), // ~$150/hr
            'start_date' => now()->toDateString(),
            'due_date' => now()->addDays(rand(14, 60))->toDateString(),
            'lead_user_id' => User::factory(),
        ];
    }
}
