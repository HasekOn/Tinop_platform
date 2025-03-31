<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Idea;
use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;


class CommentController extends Controller
{

    use AuthorizesRequests;

    /**
     * @param Request $request
     * @param Task $task
     * @return AnonymousResourceCollection
     */
    public function indexForTask(Request $request, Task $task): AnonymousResourceCollection
    {
        $request->validate(['per_page' => 'sometimes|integer|min:0|max:100']);

        $comments = $task->comments()
            ->with('user')
            ->latest()
            ->paginate($request->input('per_page', 10));

        return CommentResource::collection($comments);
    }

    /**
     * @param StoreCommentRequest $request
     * @param Task $task
     * @return CommentResource
     */
    public function storeForTask(StoreCommentRequest $request, Task $task): CommentResource
    {
        $comment = $task->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->validated('content')
        ]);

        return new CommentResource($comment->load('user'));
    }

    /**
     * @param Request $request
     * @param Idea $idea
     * @return AnonymousResourceCollection
     */
    public function indexForIdea(Request $request, Idea $idea): AnonymousResourceCollection
    {
        $request->validate(['per_page' => 'sometimes|integer|min:1|max:100']);

        $comments = $idea->comments()
            ->with('user')
            ->latest()
            ->paginate($request->input('per_page', 10));

        return CommentResource::collection($comments);
    }

    /**
     * @param StoreCommentRequest $request
     * @param Idea $idea
     * @return CommentResource
     */
    public function storeForIdea(StoreCommentRequest $request, Idea $idea): CommentResource
    {
        $comment = $idea->comments()->create([
            'user_id' => auth()->id(),
            'content' => $request->validated('content')
        ]);

        return new CommentResource($comment->load('user'));
    }

    /**
     * @param UpdateCommentRequest $request
     * @param Comment $comment
     * @return CommentResource
     * @throws AuthorizationException
     */
    public function update(UpdateCommentRequest $request, Comment $comment): CommentResource
    {
        $this->authorize('update', $comment);
        $comment->update($request->validated());

        return new CommentResource($comment->load('user'));
    }

    /**
     * @param Comment $comment
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(Comment $comment): Response
    {
        $this->authorize('delete', $comment);
        $comment->delete();

        return response()->noContent();
    }
}
