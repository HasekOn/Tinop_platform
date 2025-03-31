<?php

namespace App\Http\Controllers\Api;

use App\Filters\TaskFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskCollection;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    use AuthorizesRequests;

    /**
     * @param Request $request
     * @return TaskCollection
     */
    public function index(Request $request): TaskCollection
    {
        $filter = new TaskFilter();
        $query = Task::query()->with(['user', 'comments']);
        $queryItems = $filter->transform($request);

        if (count($queryItems) == 0) {
            return new TaskCollection(Task::paginate());
        } else {
            return new TaskCollection($query->where($queryItems)->paginate());
        }
    }

    /**
     * @param Task $task
     * @return TaskResource
     */
    public function show(Task $task): TaskResource
    {
        return new TaskResource($task->load(['user', 'comments']));
    }

    /**
     * @param StoreTaskRequest $taskRequest
     * @return TaskResource
     */
    public function store(StoreTaskRequest $taskRequest): TaskResource
    {
        $task = Task::create(
            $taskRequest->validated() + ['user_id' => auth()->id()]
        );

        return new TaskResource($task->load('user'));
    }

    /**
     * @param Task $task
     * @param UpdateTaskRequest $taskRequest
     * @return TaskResource
     * @throws AuthorizationException
     */
    public function update(Task $task, UpdateTaskRequest $taskRequest): TaskResource
    {
        $this->authorize('update', $task);
        $task->update($taskRequest->validated());

        return new TaskResource($task->fresh());
    }

    /**
     * @param Task $task
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(Task $task): Response
    {
        $this->authorize('delete', $task);

        $task->delete();
        return response()->noContent();
    }
}
