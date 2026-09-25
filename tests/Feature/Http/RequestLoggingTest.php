<?php

use Illuminate\Support\Facades\Log;

test('completed api requests log safe structured context', function () {
    Log::spy();
    $requestId = '019d787d-4f72-72ce-8f51-c42b04dbad85';

    $response = $this->withHeader('X-Request-ID', $requestId)
        ->getJson(route('api.v1.status'));

    $response->assertOk();
    Log::shouldHaveReceived('info')
        ->once()
        ->withArgs(fn (string $message, array $context) => $message === 'http.request.completed'
            && $context['request_id'] === $requestId
            && $context['method'] === 'GET'
            && $context['path'] === '/api/v1/status'
            && $context['route'] === 'api.v1.status'
            && $context['status'] === 200
            && is_float($context['duration_ms'])
            && ! array_key_exists('authorization', $context));
});
