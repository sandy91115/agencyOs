<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('reports/index', [
            'type' => $request->query('type', 'overview'),
        ]);
    }
}
