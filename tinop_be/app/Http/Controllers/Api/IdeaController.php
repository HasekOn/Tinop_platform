<?php

namespace App\Http\Controllers\Api;

use App\Filters\IdeaFilter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreIdeaRequest;
use App\Http\Requests\UpdateIdeaRequest;
use App\Http\Resources\IdeaCollection;
use App\Http\Resources\IdeaResource;
use App\Models\Idea;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class IdeaController extends Controller
{
    /**
     * @param Request $request
     * @return IdeaCollection
     */
    public function index(Request $request): IdeaCollection
    {
        $filter = new IdeaFilter();

        $queryItems =  $filter->transform($request);

        if (count($queryItems) == 0) {
            return new IdeaCollection(Idea::paginate());
        } else {
            return new IdeaCollection(Idea::query()->where($queryItems)->paginate());
        }
    }

    /**
     * @return IdeaResource
     */
    public function show(Idea $idea): IdeaResource
    {
        return new IdeaResource($idea);
    }

    /**
     * @param StoreIdeaRequest $ideaRequest
     * @return IdeaResource
     */
    public function store(StoreIdeaRequest $ideaRequest): IdeaResource
    {
        return new IdeaResource(Idea::create($ideaRequest->all()));
    }

    /**
     * @param Idea $idea
     * @param UpdateIdeaRequest $ideaRequest
     */
    public function update(Idea $idea, UpdateIdeaRequest $ideaRequest): void
    {
        $idea->update($ideaRequest->all());
    }

    /**
     * @param Idea $idea
     * @return Response
     */
    public function destroy(Idea $idea): Response
    {
        $idea->delete();
        return response()->noContent();
    }
}
