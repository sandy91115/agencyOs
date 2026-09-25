<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Models\User;
use App\Modules\Client\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        $name = fake()->unique()->company();

        return [
            'organization_id' => Organization::factory(),
            'name' => $name,
            'slug' => Str::slug($name),
            'status' => fake()->randomElement(['active', 'onboarding', 'at_risk']),
            'health' => fake()->randomElement(['healthy', 'at_risk', 'critical']),
            'health_reason' => null,
            'services' => fake()->randomElements(['Video Production', 'Creative', 'Paid Social', 'SEO', 'Brand Strategy', 'Full-Stack Dev'], rand(1, 3)),
            'monthly_retainer_cents' => fake()->randomElement([500000, 1000000, 1500000, 2200000]),
            'margin_percent' => fake()->numberBetween(50, 80),
            'lead_contact_name' => fake()->name(),
            'lead_contact_email' => fake()->safeEmail(),
            'owner_user_id' => User::factory(),
        ];
    }
}
