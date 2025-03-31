<?php

namespace App\Filters;

use Illuminate\Http\Request;

class UserAvailabilityFilter
{
    public function transform(Request $request): array
    {
        $filters = [];

        foreach ($request->query() as $param => $value) {
            $filterMethod = 'filterBy' . str_replace(' ', '', ucwords(str_replace('_', ' ', $param)));

            if (method_exists($this, $filterMethod)) {
                array_push($filters, ...$this->$filterMethod($value));
            }
        }

        return $filters;
    }

    protected function filterByDateRange($range): array
    {
        return [
            ['date', '>=', $range[0]],
            ['date', '<=', $range[1]]
        ];
    }

    protected function filterByUser($userId): array
    {
        return [['user_id', '=', $userId]];
    }

    protected function filterByStatus($status): array
    {
        return [['status', '=', $status]];
    }
}
