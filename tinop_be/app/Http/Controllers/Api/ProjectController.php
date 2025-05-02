<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectCollection;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Models\ProjectUser;
use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    /**
     * @return ProjectCollection
     */
    public function index()
    {
        $userId = auth()->id();

        $projects = Project::with(['creator', 'tasks'])
            ->where(function ($query) use ($userId) {
                $query->where('creator_id', $userId)
                    ->orWhereHas('members', function ($q) use ($userId) {
                        $q->where('user_id', $userId)
                            ->where('status', 'accepted');
                    });
            })
            ->paginate();

        return new ProjectCollection($projects);
    }

    /**
     * @param Project $project
     * @return ProjectResource
     * @throws AuthorizationException
     */
    public function show(Project $project): ProjectResource
    {
        $this->authorize('view', $project);
        return new ProjectResource($project->load(['creator', 'tasks']));
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

    /**
     * @param Project $project
     * @param Request $request
     * @return JsonResponse
     * @throws AuthorizationException
     */
    public function inviteUser(Project $project, Request $request): JsonResponse
    {
        $this->authorize('manage', $project);

        $request->validate([
            'email' => 'required|email'
        ]);

        $token = Str::random(60);

        $project->members()->attach(auth()->id(), [
            'email' => $request->email,
            'token' => $token,
            'status' => 'pending'
        ]);

        // Odeslat e-mail s pozvánkou
        // Mail::to($request->email)->send(new ProjectInvitationMail($project, $token));

        return response()->json(['message' => 'Invitation sent']);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function acceptInvitation(Request $request): JsonResponse
    {
        $request->validate(['token' => 'required']);

        $invitation = ProjectUser::where('token', $request->token)->firstOrFail();

        if (auth()->check()) {
            if (auth()->user()->email !== $invitation->email) {
                abort(403, 'This invitation does not match your account');
            }

            $invitation->update(['status' => 'accepted', 'user_id' => auth()->id()]);
            return response()->json(['message' => 'Invitation accepted']);
        }

        return response()->json([
            'action_required' => 'login_or_register',
            'invitation_token' => $request->token
        ], 401);
    }

    /**
     * @param Project $project
     * @param User $user
     * @return Response
     * @throws AuthorizationException
     */
    public function removeUser(Project $project, User $user): Response
    {
        $this->authorize('manage', $project);

        $project->members()->detach($user->id);
        return response()->noContent();
    }
}
