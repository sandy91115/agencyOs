<?php

namespace App\Http\Controllers;

use App\Modules\Task\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    public function index(Request $request): Response
    {
        $organization = $request->user()->currentOrganization;

        $tasks = $organization ? Task::query()
            ->where('organization_id', $organization->id)
            ->with([
                'assignedUser:id,name,email',
                'checklists',
                'comments.user:id,name,email',
                'timeLogs.user:id,name,email',
            ])
            ->orderByRaw("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END")
            ->orderBy('due_date')
            ->get() : collect();

        return Inertia::render('my-work', [
            'initialTab' => $request->query('tab', 'today'),
            'tasks' => $tasks,
        ]);
    }
}
