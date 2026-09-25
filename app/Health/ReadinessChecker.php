<?php

namespace App\Health;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Throwable;

class ReadinessChecker
{
    /**
     * @return array{ready: bool, checks: array<string, string>}
     */
    public function check(): array
    {
        $checks = [];

        foreach (config('health.readiness', []) as $dependency) {
            $checks[$dependency] = $this->checkDependency($dependency);
        }

        return [
            'ready' => ! in_array('unavailable', $checks, true),
            'checks' => $checks,
        ];
    }

    private function checkDependency(string $dependency): string
    {
        try {
            match ($dependency) {
                'database' => DB::connection()->getPdo(),
                'redis' => Redis::connection()->ping(),
                default => throw new \LogicException("Unknown readiness dependency: {$dependency}"),
            };

            return 'available';
        } catch (Throwable) {
            return 'unavailable';
        }
    }
}
