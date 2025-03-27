<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{

    /**
     * Name of factory corresponding model
     *
     * @var string
     */
    protected $model = Task::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1,
            'name' => fake()->name(),
            'status' => fake()->boolean() ? 'TO DO' : 'IN PROGRESS',
            'effort' => fake()->boolean() ? 'easy' : 'hard',
            'priority' => fake()->boolean() ? 'low' : 'medium',
            'timeEst' => now()->addHours(2),
            'description' => fake()->text(),
        ];
    }
}
