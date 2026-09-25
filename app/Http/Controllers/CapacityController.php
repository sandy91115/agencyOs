<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CapacityController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('capacity/index', [
            'timeframe' => $request->query('timeframe', 'week'),
        ]);
    }
}
