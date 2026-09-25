<?php

namespace App\Http\Responses;

use App\Http\Middleware\AssignRequestId;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use stdClass;

class ApiResponse
{
    /**
     * @param  array<string, mixed>  $meta
     */
    public static function success(
        Request $request,
        mixed $data,
        array $meta = [],
        int $status = 200,
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => self::meta($request, $meta),
        ], $status);
    }

    /**
     * @param  array<string, mixed>  $fields
     * @param  array<string, mixed>  $meta
     */
    public static function error(
        Request $request,
        string $code,
        string $message,
        array $fields = [],
        int $status = 400,
        array $meta = [],
    ): JsonResponse {
        return response()->json([
            'success' => false,
            'error' => [
                'code' => $code,
                'message' => $message,
                'fields' => $fields === [] ? new stdClass : $fields,
            ],
            'meta' => self::meta($request, $meta),
        ], $status);
    }

    /**
     * @param  array<string, mixed>  $meta
     * @return array<string, mixed>
     */
    private static function meta(Request $request, array $meta): array
    {
        return [
            ...$meta,
            'request_id' => $request->attributes->get(AssignRequestId::ATTRIBUTE),
        ];
    }
}
