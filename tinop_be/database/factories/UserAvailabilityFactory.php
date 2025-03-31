<?php

namespace Database\Factories;

use App\Models\UserAvailability;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAvailability>
 */
class UserAvailabilityFactory extends Factory
{
    /**
     * Name of factory corresponding model
     *
     * @var string
     */
    protected $model = UserAvailability::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1,
            'date' => fake()->date(),
            'status' => $this->faker->randomElement(['office', 'remote', 'vacation', 'unavailable']),
            'notes' => Str::random(40),
        ];
    }
}
