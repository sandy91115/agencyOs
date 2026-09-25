<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use RuntimeException;

beforeEach(function () {
    Route::middleware('api')->prefix('api/v1/testing')->group(function () {
        Route::post('validation', function (Request $request) {
            $request->validate([
                'name' => ['required', 'string'],
            ]);
        });

        Route::get('authenticated', fn () => response()->json())
            ->middleware('auth');

        Route::get('failure', fn () => throw new RuntimeException('Sensitive internal detail'));
    });
});

test('status endpoint returns the success envelope and a request id', function () {
    $response = $this->getJson(route('api.v1.status'));

    $response
        ->assertOk()
        ->assertHeader('X-Request-ID')
        ->assertJson([
            'success' => true,
            'data' => [
                'service' => 'AgencyOS API',
                'status' => 'ok',
            ],
        ]);

    expect($response->json('meta.request_id'))
        ->toBe($response->headers->get('X-Request-ID'))
        ->toBeUuid();
});

test('valid client request id is preserved for correlation', function () {
    $requestId = '019d787d-4f72-72ce-8f51-c42b04dbad85';

    $response = $this->withHeader('X-Request-ID', strtoupper($requestId))
        ->getJson(route('api.v1.status'));

    $response
        ->assertOk()
        ->assertHeader('X-Request-ID', $requestId)
        ->assertJsonPath('meta.request_id', $requestId);
});

test('invalid client request id is replaced', function () {
    $response = $this->withHeader('X-Request-ID', "invalid\r\nvalue")
        ->getJson(route('api.v1.status'));

    $response->assertOk();

    expect($response->json('meta.request_id'))
        ->not->toBe('invalid value')
        ->toBeUuid();
});

test('validation errors use the stable error envelope', function () {
    $response = $this->postJson('/api/v1/testing/validation');

    $response
        ->assertUnprocessable()
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'VALIDATION_FAILED')
        ->assertJsonPath('error.message', 'The submitted data is invalid.')
        ->assertJsonPath('error.fields.name.0', 'The name field is required.')
        ->assertJsonPath('meta.request_id', $response->headers->get('X-Request-ID'));
});

test('unauthenticated api requests use the stable error envelope', function () {
    $response = $this->getJson('/api/v1/testing/authenticated');

    $response
        ->assertUnauthorized()
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'AUTHENTICATION_REQUIRED')
        ->assertJsonPath('error.fields', [])
        ->assertJsonPath('meta.request_id', $response->headers->get('X-Request-ID'));
});

test('unknown api routes use a safe not found envelope', function () {
    $response = $this->getJson('/api/v1/does-not-exist');

    $response
        ->assertNotFound()
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'RESOURCE_NOT_FOUND')
        ->assertJsonPath('error.fields', [])
        ->assertJsonPath('meta.request_id', $response->headers->get('X-Request-ID'));

    expect($response->json('meta.request_id'))->toBeUuid();
});

test('unexpected api failures do not expose internal details', function () {
    $response = $this->getJson('/api/v1/testing/failure');

    $response
        ->assertServerError()
        ->assertJsonPath('success', false)
        ->assertJsonPath('error.code', 'INTERNAL_ERROR')
        ->assertJsonMissing(['message' => 'Sensitive internal detail'])
        ->assertJsonPath('meta.request_id', $response->headers->get('X-Request-ID'));

    expect($response->json('meta.request_id'))->toBeUuid();
});
