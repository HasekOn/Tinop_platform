<?php

namespace Database\Seeders;

use App\Models\UserAvailability;
use Illuminate\Database\Seeder;

class UserAvailabilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserAvailability::factory()
            ->count(10)
            ->create();
    }
}
