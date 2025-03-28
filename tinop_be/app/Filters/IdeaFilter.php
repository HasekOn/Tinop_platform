<?php

namespace App\Filters;

class IdeaFilter extends ApiFilter
{
    protected $allowedParms = [
        'name' => ['eq'],
        'likes' => ['eq', 'gt', 'lt'],
        'dislikes' => ['eq', 'gt', 'lt'],
    ];

    protected  $operatorMap = [
        'eq' => '=',
        'gt' => '>',
        'lt' => '<',
    ];
}
