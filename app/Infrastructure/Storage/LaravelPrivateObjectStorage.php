<?php

namespace App\Infrastructure\Storage;

use App\Contracts\Storage\PrivateObjectStorage;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Filesystem\FilesystemManager;
use Illuminate\Support\Str;
use InvalidArgumentException;

class LaravelPrivateObjectStorage implements PrivateObjectStorage
{
    private readonly Filesystem $disk;

    public function __construct(FilesystemManager $filesystems)
    {
        $this->disk = $filesystems->disk(config('filesystems.private_disk'));
    }

    public function put(string $organizationId, string $key, string $contents): string
    {
        $path = $this->path($organizationId, $key);
        $this->disk->put($path, $contents, ['visibility' => 'private']);

        return $path;
    }

    public function read(string $organizationId, string $key): string
    {
        return $this->disk->get($this->path($organizationId, $key));
    }

    public function exists(string $organizationId, string $key): bool
    {
        return $this->disk->exists($this->path($organizationId, $key));
    }

    public function delete(string $organizationId, string $key): void
    {
        $this->disk->delete($this->path($organizationId, $key));
    }

    private function path(string $organizationId, string $key): string
    {
        if (! Str::isUuid($organizationId)) {
            throw new InvalidArgumentException('A valid organization UUID is required.');
        }

        if ($key === '' || str_contains($key, "\0") || str_contains($key, '\\')) {
            throw new InvalidArgumentException('The object key is invalid.');
        }

        $segments = explode('/', $key);

        if ($key[0] === '/' || in_array('', $segments, true) || in_array('.', $segments, true) || in_array('..', $segments, true)) {
            throw new InvalidArgumentException('The object key is invalid.');
        }

        return "organizations/{$organizationId}/{$key}";
    }
}
