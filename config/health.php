<?php

return [
    'readiness' => array_values(array_filter(array_map(
        'trim',
        explode(',', (string) env('HEALTH_READINESS_DEPENDENCIES', 'database,redis')),
    ))),
];
