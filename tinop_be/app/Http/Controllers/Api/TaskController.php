<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use App\Http\Resources\TaskResource;
use App\Http\Resources\TaskCollection;
use App\Filters\TaskFilter;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    /**
     * @param Request $request
     * @return TaskCollection
     */
    public function index(Request $request): TaskCollection
    {
        $filter = new TaskFilter();

        $queryItems =  $filter->transform($request);

        if (count($queryItems) == 0) {
            return new TaskCollection(Task::paginate());
        } else {
            return new TaskCollection(Task::query()->where($queryItems)->paginate());
        }
    }

    /**
     * @param Task $task
     * @return TaskResource
     */
    public function show(Task $task): TaskResource
    {
        return new TaskResource($task);
    }

    /**
     * @param StoreTaskRequest $taskRequest
     * @return TaskResource
     */
    public function store(StoreTaskRequest $taskRequest): TaskResource
    {
        return new TaskResource(Task::create($taskRequest->all()));
    }

    /**
     * @param Task $task
     * @param UpdateTaskRequest $taskRequest
     */
    public function update(Task $task, UpdateTaskRequest $taskRequest): void
    {
        $task->update($taskRequest->all());
    }

    /**
     * @param Task $task
     * @return Response
     */
    public function destroy(Task $task): Response
    {
        $task->delete();
        return response()->noContent();
    }

}
