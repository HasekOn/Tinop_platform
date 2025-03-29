<?php

namespace App\Http\Controllers\Api;

use App\Filters\IdeaFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIdeaRequest;
use App\Http\Requests\UpdateIdeaRequest;
use App\Http\Resources\IdeaCollection;
use App\Http\Resources\IdeaResource;
use App\Models\Idea;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class IdeaController extends Controller
{
    use AuthorizesRequests;

    /**
     * @param Request $request
     * @return IdeaCollection
     */
    public function index(Request $request): IdeaCollection
    {
        $filter = new IdeaFilter();
        $query = Idea::query()->with(['user', 'comments']);
        $queryItems =  $filter->transform($request);

        if (count($queryItems) == 0) {
            return new IdeaCollection(Idea::paginate());
        } else {
            return new IdeaCollection($query->where($queryItems)->paginate());
        }
    }

    /**
     * @param Idea $idea
     * @return IdeaResource
     */
    public function show(Idea $idea): IdeaResource
    {
        return new IdeaResource($idea->load(['user', 'comments']));
    }

    /**
     * @param StoreIdeaRequest $ideaRequest
     * @return IdeaResource
     */
    public function store(StoreIdeaRequest $ideaRequest): IdeaResource
    {
        $idea = Idea::create(
            $ideaRequest->validated() + ['user_id' => auth()->id()]
        );

        return new IdeaResource($idea->load('user'));
    }

    /**
     * @param Idea $idea
     * @param UpdateIdeaRequest $ideaRequest
     * @return IdeaResource
     * @throws AuthorizationException
     */
    public function update(Idea $idea, UpdateIdeaRequest $ideaRequest): IdeaResource
    {
        $this->authorize('update', $idea);

        $idea->update($ideaRequest->all());

        return new IdeaResource($idea->fresh());
    }

    /**
     * @param Idea $idea
     * @return Response
     * @throws AuthorizationException
     */
    public function destroy(Idea $idea): Response
    {
        $this->authorize('delete', $idea);

        $idea->delete();
        return response()->noContent();
    }
}
