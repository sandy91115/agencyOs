<?php

use App\Http\Middleware\AssignRequestId;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\LogRequest;
use App\Http\Middleware\SetOrganizationUrlDefaults;
use App\Http\Responses\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SetOrganizationUrlDefaults::class,
        ]);

        // Global registration also covers unmatched /api routes before a route
        // middleware group can be selected.
        $middleware->append([
            AssignRequestId::class,
            LogRequest::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (Throwable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            return match (true) {
                $exception instanceof ValidationException => ApiResponse::error(
                    $request,
                    'VALIDATION_FAILED',
                    'The submitted data is invalid.',
                    $exception->errors(),
                    422,
                ),
                $exception instanceof AuthenticationException => ApiResponse::error(
                    $request,
                    'AUTHENTICATION_REQUIRED',
                    'Authentication is required.',
                    status: 401,
                ),
                $exception instanceof AuthorizationException => ApiResponse::error(
                    $request,
                    'AUTHORIZATION_DENIED',
                    'You are not authorized to perform this action.',
                    status: 403,
                ),
                $exception instanceof ModelNotFoundException,
                $exception instanceof NotFoundHttpException => ApiResponse::error(
                    $request,
                    'RESOURCE_NOT_FOUND',
                    'The requested resource was not found.',
                    status: 404,
                ),
                $exception instanceof TooManyRequestsHttpException => ApiResponse::error(
                    $request,
                    'RATE_LIMIT_EXCEEDED',
                    'Too many requests. Please try again later.',
                    status: 429,
                ),
                $exception instanceof HttpExceptionInterface => ApiResponse::error(
                    $request,
                    'HTTP_ERROR',
                    'The request could not be completed.',
                    status: $exception->getStatusCode(),
                ),
                default => ApiResponse::error(
                    $request,
                    'INTERNAL_ERROR',
                    'An unexpected error occurred. Use the request ID when contacting support.',
                    status: 500,
                ),
            };
        });
    })->create();
