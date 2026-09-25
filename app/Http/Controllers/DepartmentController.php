<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('departments/index', [
            'selected' => $request->query('dept', 'all'),
        ]);
    }
}
