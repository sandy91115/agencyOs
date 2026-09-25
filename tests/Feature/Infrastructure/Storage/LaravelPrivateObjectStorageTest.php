<?php

use App\Contracts\Storage\PrivateObjectStorage;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

test('private object storage completes a tenant-prefixed round trip', function () {
    Storage::fake('private');
    $organizationId = '019d787d-4f72-72ce-8f51-c42b04dbad85';
    $storage = app(PrivateObjectStorage::class);

    $path = $storage->put($organizationId, 'assets/brief.txt', 'confidential brief');

    expect($path)->toBe("organizations/{$organizationId}/assets/brief.txt");
    expect($storage->exists($organizationId, 'assets/brief.txt'))->toBeTrue();
    expect($storage->read($organizationId, 'assets/brief.txt'))->toBe('confidential brief');
    Storage::disk('private')->assertExists($path);

    $storage->delete($organizationId, 'assets/brief.txt');

    expect($storage->exists($organizationId, 'assets/brief.txt'))->toBeFalse();
});

test('the same object key remains isolated between organizations', function () {
    Storage::fake('private');
    $firstOrganization = '019d787d-4f72-72ce-8f51-c42b04dbad85';
    $secondOrganization = '019d787e-17f7-7158-85f0-85a356069a7e';
    $storage = app(PrivateObjectStorage::class);

    $storage->put($firstOrganization, 'assets/logo.svg', 'first');
    $storage->put($secondOrganization, 'assets/logo.svg', 'second');

    expect($storage->read($firstOrganization, 'assets/logo.svg'))->toBe('first');
    expect($storage->read($secondOrganization, 'assets/logo.svg'))->toBe('second');
});

test('invalid organization identifiers are rejected before storage access', function () {
    Storage::fake('private');
    $storage = app(PrivateObjectStorage::class);

    expect(fn () => $storage->put('1', 'assets/file.txt', 'contents'))
        ->toThrow(InvalidArgumentException::class, 'A valid organization UUID is required.');

    Storage::disk('private')->assertDirectoryEmpty('/');
});

test('unsafe object keys are rejected before storage access', function (string $key) {
    Storage::fake('private');
    $organizationId = '019d787d-4f72-72ce-8f51-c42b04dbad85';
    $storage = app(PrivateObjectStorage::class);

    expect(fn () => $storage->put($organizationId, $key, 'contents'))
        ->toThrow(InvalidArgumentException::class, 'The object key is invalid.');

    Storage::disk('private')->assertDirectoryEmpty('/');
})->with([
    'empty key' => '',
    'absolute path' => '/assets/file.txt',
    'parent traversal' => 'assets/../file.txt',
    'current traversal' => 'assets/./file.txt',
    'empty segment' => 'assets//file.txt',
    'windows separator' => 'assets\\file.txt',
    'null byte' => "assets/file\0.txt",
]);
