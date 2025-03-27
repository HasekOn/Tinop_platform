<?php

namespace App\Filters;

use App\Filters\ApiFilter;

class TaskFilter extends ApiFilter
{
    protected $allowedParms = [
        'name' => ['eq'],
        'status' => ['eq'],
        'effort' => ['eq'],
        'priority' => ['eq'],
        'timeEst' => ['eq', 'gt', 'lt'],
    ];

    protected  $operatorMap = [
        'eq' => '=',
        'gt' => '>',
        'lt' => '<',
    ];
}
