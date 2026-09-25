<?php

use App\Logging\RedactSensitiveData;
use Monolog\Level;
use Monolog\LogRecord;

test('sensitive context and extra fields are recursively redacted', function () {
    $record = new LogRecord(
        datetime: now()->toDateTimeImmutable(),
        channel: 'testing',
        level: Level::Info,
        message: 'integration.request',
        context: [
            'client_id' => 'client-123',
            'authorization' => 'Bearer private-token',
            'provider' => [
                'access_token' => 'private-token',
                'api-key' => 'private-key',
                'region' => 'eu-west-1',
            ],
        ],
        extra: [
            'password_confirmation' => 'private-password',
            'request_id' => 'request-123',
        ],
    );

    $redacted = (new RedactSensitiveData)($record);

    expect($redacted->context)->toBe([
        'client_id' => 'client-123',
        'authorization' => '[REDACTED]',
        'provider' => [
            'access_token' => '[REDACTED]',
            'api-key' => '[REDACTED]',
            'region' => 'eu-west-1',
        ],
    ]);
    expect($redacted->extra)->toBe([
        'password_confirmation' => '[REDACTED]',
        'request_id' => 'request-123',
    ]);
});
