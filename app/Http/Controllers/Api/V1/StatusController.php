<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        return ApiResponse::success($request, [
            'service' => 'AgencyOS API',
            'status' => 'ok',
        ]);
    }
}
