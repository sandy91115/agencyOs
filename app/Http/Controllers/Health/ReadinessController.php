<?php

namespace App\Http\Controllers\Health;

use App\Health\ReadinessChecker;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ReadinessController extends Controller
{
    public function __invoke(ReadinessChecker $checker): JsonResponse
    {
        $result = $checker->check();

        return response()->json([
            'status' => $result['ready'] ? 'ready' : 'unavailable',
            'checks' => $result['checks'],
        ], $result['ready'] ? 200 : 503);
    }
}
