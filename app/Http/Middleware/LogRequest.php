<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogRequest
{
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = hrtime(true);
        $response = $next($request);

        Log::info('http.request.completed', array_filter([
            'request_id' => $request->attributes->get(AssignRequestId::ATTRIBUTE),
            'method' => $request->method(),
            'path' => '/'.$request->path(),
            'route' => $request->route()?->getName(),
            'status' => $response->getStatusCode(),
            'duration_ms' => round((hrtime(true) - $startedAt) / 1_000_000, 2),
            'user_id' => $request->user()?->getAuthIdentifier(),
            'organization_id' => $request->user()?->current_organization_id,
        ], fn (mixed $value) => $value !== null));

        return $response;
    }
}
