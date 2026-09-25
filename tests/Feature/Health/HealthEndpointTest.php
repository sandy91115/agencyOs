<?php

use App\Health\ReadinessChecker;

test('liveness reports that the application process can respond', function () {
    $response = $this->getJson(route('health.live'));

    $response
        ->assertOk()
        ->assertExactJson(['status' => 'ok']);
});

test('readiness reports available required dependencies', function () {
    $checker = Mockery::mock(ReadinessChecker::class);
    $checker->shouldReceive('check')->once()->andReturn([
        'ready' => true,
        'checks' => [
            'database' => 'available',
            'redis' => 'available',
        ],
    ]);
    $this->app->instance(ReadinessChecker::class, $checker);

    $response = $this->getJson(route('health.ready'));

    $response
        ->assertOk()
        ->assertExactJson([
            'status' => 'ready',
            'checks' => [
                'database' => 'available',
                'redis' => 'available',
            ],
        ]);
});

test('readiness returns service unavailable without exposing connection details', function () {
    $checker = Mockery::mock(ReadinessChecker::class);
    $checker->shouldReceive('check')->once()->andReturn([
        'ready' => false,
        'checks' => [
            'database' => 'available',
            'redis' => 'unavailable',
        ],
    ]);
    $this->app->instance(ReadinessChecker::class, $checker);

    $response = $this->getJson(route('health.ready'));

    $response
        ->assertServiceUnavailable()
        ->assertExactJson([
            'status' => 'unavailable',
            'checks' => [
                'database' => 'available',
                'redis' => 'unavailable',
            ],
        ]);
});
