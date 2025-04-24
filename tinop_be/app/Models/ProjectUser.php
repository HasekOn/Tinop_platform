<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectUser extends Pivot
{
    protected $table = 'project_user';
    protected $casts = [
        'status' => 'string',
        'token' => 'string'
    ];
}
