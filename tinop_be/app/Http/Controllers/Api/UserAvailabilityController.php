<?php

namespace App\Http\Controllers\Api;

use App\Filters\UserAvailabilityFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserAvailabilityRequest;
use App\Http\Requests\UpdateUserAvailabilityRequest;
use App\Http\Resources\UserAvailabilityCollection;
use App\Http\Resources\UserAvailabilityResource;
use App\Models\User;
use App\Models\UserAvailability;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class UserAvailabilityController extends Controller
{
    use AuthorizesRequests;

    /**
     * @param Request $request
     * @return UserAvailabilityCollection
     */
    public function index(Request $request): UserAvailabilityCollection
    {
        $filter = new UserAvailabilityFilter();
        $query = UserAvailability::query()->with('user');
        $queryItems = $filter->transform($request);

        if (!empty($queryItems)) {
            $query->where($queryItems);
        }

        return new UserAvailabilityCollection($query->paginate());
    }

    /**
     * @param StoreUserAvailabilityRequest $request
     * @return UserAvailabilityResource
     */
    public function store(StoreUserAvailabilityRequest $request): UserAvailabilityResource
    {
        $availability = UserAvailability::create(
            $request->validated() + ['user_id' => auth()->id()]
        );

        return new UserAvailabilityResource($availability->load('user'));
    }

    /**
     * @param UserAvailability $availability
     * @return UserAvailabilityResource
     */
    public function show(UserAvailability $availability): UserAvailabilityResource
    {
        return new UserAvailabilityResource($availability->load('user'));
    }

    /**
     * @param UserAvailability $availability
     * @param UpdateUserAvailabilityRequest $request
     * @return UserAvailabilityResource
     * @throws AuthorizationException
     */
    public function update(UserAvailability $availability, UpdateUserAvailabilityRequest $request): UserAvailabilityResource
    {
        $this->authorize('update', $availability);
        $availability->update($request->validated());

        return new UserAvailabilityResource($availability->fresh());
    }

    /**
     * @param UserAvailability $availability
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(UserAvailability $availability): Response
    {
        $this->authorize('delete', $availability);
        $availability->delete();

        return response()->noContent();
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function allUsersAvailability(Request $request): JsonResponse
    {
        try {
            $users = User::all();

            $all = UserAvailability::all()->groupBy('user_id');

            $result = $users->map(function (User $user) use ($all) {
                $userAvailabilities = $all->get($user->id, collect());

                $days = $userAvailabilities->map(function ($avail) {
                    return [
                        'date' => $avail->date,
                        'id' => $avail->id,
                        'availability' => $avail->status ?? 'office',
                        'description' => $avail->notes ?? '',
                        'isEditable' => $avail->user_id === auth()->id(),
                    ];
                })->sortBy('date')->values();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'week' => $days,
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => [
                    'users' => $result,
                    'period' => 'all',
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Chyba při načítání availability: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Při načítání availability došlo k chybě',
            ], 500);
        }
    }

}
