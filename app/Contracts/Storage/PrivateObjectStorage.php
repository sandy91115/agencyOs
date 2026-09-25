<?php

namespace App\Contracts\Storage;

interface PrivateObjectStorage
{
    public function put(string $organizationId, string $key, string $contents): string;

    public function read(string $organizationId, string $key): string;

    public function exists(string $organizationId, string $key): bool;

    public function delete(string $organizationId, string $key): void;
}
