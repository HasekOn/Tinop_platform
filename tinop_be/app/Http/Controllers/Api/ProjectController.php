<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectCollection;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return ProjectCollection
     */
    public function index(): ProjectCollection
    {
        return new ProjectCollection(
            Project::with(['user', 'tasks'])->paginate()
        );
    }

    /**
     * @param Project $project
     * @return ProjectResource
     * @throws AuthorizationException
     */
    public function show(Project $project): ProjectResource
    {
        $this->authorize('view', $project);
        return new ProjectResource($project->load(['user', 'tasks']));
    }

    /**
     * @param StoreProjectRequest $request
     * @return ProjectResource
     */
    public function store(StoreProjectRequest $request): ProjectResource
    {
        $project = Project::create($request->validated() + ['user_id' => auth()->id()]);
        return new ProjectResource($project);
    }

    /**
     * @param Project $project
     * @param UpdateProjectRequest $request
     * @return ProjectResource
     * @throws AuthorizationException
     */
    public function update(Project $project, UpdateProjectRequest $request): ProjectResource
    {
        $this->authorize('update', $project);
        $project->update($request->validated());
        return new ProjectResource($project->fresh());
    }

    /**
     * @param Project $project
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(Project $project): Response
    {
        $this->authorize('delete', $project);
        $project->delete();
        return response()->noContent();
    }

    /**
     * @param Project $project
     * @param Request $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function attachTask(Project $project, Request $request): JsonResponse
    {
        $this->authorize('update', $project);
        $request->validate(['task_id' => 'required|exists:tasks,id']);
        $project->tasks()->attach($request->task_id);
        return response()->json(['message' => 'Task attached']);
    }

    /**
     * @param Project $project
     * @param Task $task
     * @return Response
     * @throws AuthorizationException
     */
    public function detachTask(Project $project, Task $task): Response
    {
        $this->authorize('update', $project);
        $project->tasks()->detach($task->id);
        return response()->noContent();
    }
}
