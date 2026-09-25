<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Client\Models\Client;
use App\Modules\Project\Models\Project;
use App\Modules\Task\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'test@example.com')->first()
            ?? User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $organization = $user->personalOrganization();

        if ($organization && Client::where('organization_id', $organization->id)->count() === 0) {
            // Seed Clients
            $acme = Client::create([
                'organization_id' => $organization->id,
                'name' => 'Acme Corp',
                'slug' => 'acme-corp',
                'status' => 'active',
                'health' => 'healthy',
                'services' => ['Video Production', 'Creative', 'Paid Social'],
                'monthly_retainer_cents' => 1850000,
                'margin_percent' => 71,
                'lead_contact_name' => 'Sarah Jenkins',
                'lead_contact_email' => 'sarah.j@acme.com',
                'owner_user_id' => $user->id,
            ]);

            $apex = Client::create([
                'organization_id' => $organization->id,
                'name' => 'Apex Retail Group',
                'slug' => 'apex-retail',
                'status' => 'at_risk',
                'health' => 'critical',
                'health_reason' => '2 client deliverables overdue; capacity bottleneck in Motion Design team',
                'services' => ['Short-Form Video', 'Creative'],
                'monthly_retainer_cents' => 1200000,
                'margin_percent' => 54,
                'lead_contact_name' => 'Marcus Vance',
                'lead_contact_email' => 'm.vance@apexretail.com',
                'owner_user_id' => $user->id,
            ]);

            $pulse = Client::create([
                'organization_id' => $organization->id,
                'name' => 'Pulse Health',
                'slug' => 'pulse-health',
                'status' => 'active',
                'health' => 'at_risk',
                'health_reason' => 'Pending design token approval from client CTO; timeline compressed by 3 days',
                'services' => ['Brand Refresh', 'Full-Stack Dev'],
                'monthly_retainer_cents' => 1450000,
                'margin_percent' => 62,
                'lead_contact_name' => 'Dr. Elena Rostova',
                'lead_contact_email' => 'elena@pulsehealth.io',
                'owner_user_id' => $user->id,
            ]);

            $strata = Client::create([
                'organization_id' => $organization->id,
                'name' => 'Strata FinTech',
                'slug' => 'strata-fintech',
                'status' => 'active',
                'health' => 'healthy',
                'services' => ['SEO Architecture', 'Content Marketing'],
                'monthly_retainer_cents' => 2200000,
                'margin_percent' => 76,
                'lead_contact_name' => 'David Chen',
                'lead_contact_email' => 'dchen@stratafin.com',
                'owner_user_id' => $user->id,
            ]);

            $luminary = Client::create([
                'organization_id' => $organization->id,
                'name' => 'Luminary Lighting Co.',
                'slug' => 'luminary-co',
                'status' => 'active',
                'health' => 'healthy',
                'services' => ['Social Retainer', 'Graphic Design'],
                'monthly_retainer_cents' => 950000,
                'margin_percent' => 68,
                'lead_contact_name' => 'Chloe Bennett',
                'lead_contact_email' => 'chloe@luminary.co',
                'owner_user_id' => $user->id,
            ]);

            // Seed Projects
            $proj1 = Project::create([
                'organization_id' => $organization->id,
                'client_id' => $acme->id,
                'name' => 'Q4 Global Product Commercial Launch',
                'slug' => 'q4-commercial-launch',
                'description' => 'Multi-channel commercial launch campaign including a 60s hero commercial, YouTube prerolls, and digital out-of-home assets.',
                'status' => 'in_progress',
                'health' => 'on_track',
                'billing_type' => 'retainer',
                'budget_hours' => 80.0,
                'spent_hours' => 54.0,
                'remaining_hours' => 26.0,
                'budget_cents' => 1200000,
                'start_date' => now()->subDays(10)->toDateString(),
                'due_date' => now()->addDays(14)->toDateString(),
                'lead_user_id' => $user->id,
            ]);

            $proj2 = Project::create([
                'organization_id' => $organization->id,
                'client_id' => $apex->id,
                'name' => 'High-Velocity TikTok Reels Retainer',
                'slug' => 'reels-retainer',
                'description' => 'Weekly delivery of 8 viral hook variations and motion graphics overlays for e-commerce conversion optimization.',
                'status' => 'at_risk',
                'health' => 'critical',
                'health_reason' => 'Behind schedule by 48h due to script revisions and motion editor backlog.',
                'billing_type' => 'retainer',
                'budget_hours' => 60.0,
                'spent_hours' => 48.0,
                'remaining_hours' => 22.0,
                'budget_cents' => 900000,
                'start_date' => now()->subDays(12)->toDateString(),
                'due_date' => now()->addDays(3)->toDateString(),
                'lead_user_id' => $user->id,
            ]);

            $proj3 = Project::create([
                'organization_id' => $organization->id,
                'client_id' => $pulse->id,
                'name' => 'Design System & Component Tokens Refresh',
                'slug' => 'design-system-tokens',
                'description' => 'Exporting and syncing brand typography, color primitives, and component spec tokens directly to developer repos.',
                'status' => 'review',
                'health' => 'at_risk',
                'health_reason' => 'Awaiting token schema validation from client technical lead.',
                'billing_type' => 'fixed',
                'budget_hours' => 120.0,
                'spent_hours' => 112.0,
                'remaining_hours' => 8.0,
                'budget_cents' => 1800000,
                'start_date' => now()->subDays(20)->toDateString(),
                'due_date' => now()->addDays(5)->toDateString(),
                'lead_user_id' => $user->id,
            ]);

            $proj4 = Project::create([
                'organization_id' => $organization->id,
                'client_id' => $strata->id,
                'name' => 'Enterprise Technical SEO Core Migration',
                'slug' => 'seo-core-migration',
                'description' => 'Full crawl analysis, canonical tag reconciliation, and site architecture redesign across 45,000 indexable URLs.',
                'status' => 'in_progress',
                'health' => 'on_track',
                'billing_type' => 'time_and_materials',
                'budget_hours' => 150.0,
                'spent_hours' => 90.0,
                'remaining_hours' => 60.0,
                'budget_cents' => 2250000,
                'start_date' => now()->subDays(15)->toDateString(),
                'due_date' => now()->addDays(25)->toDateString(),
                'lead_user_id' => $user->id,
            ]);

            $proj5 = Project::create([
                'organization_id' => $organization->id,
                'client_id' => $luminary->id,
                'name' => 'Social Retainer & Monthly Creative Assets',
                'slug' => 'social-retainer',
                'description' => 'Ongoing content pillar design, Instagram story asset packs, and campaign banner creatives.',
                'status' => 'in_progress',
                'health' => 'on_track',
                'billing_type' => 'retainer',
                'budget_hours' => 45.0,
                'spent_hours' => 28.0,
                'remaining_hours' => 17.0,
                'budget_cents' => 675000,
                'start_date' => now()->subDays(8)->toDateString(),
                'due_date' => now()->addDays(18)->toDateString(),
                'lead_user_id' => $user->id,
            ]);

            // Update or create tasks with client and project links
            Task::where('organization_id', $organization->id)->delete();

            // Task 1
            $task1 = Task::create([
                'organization_id' => $organization->id,
                'client_id' => $acme->id,
                'project_id' => $proj1->id,
                'client_name' => $acme->name,
                'project_name' => $proj1->name,
                'title' => 'Color grade 60-second hero commercial for TV/YouTube broadcast',
                'brief' => "Conform RAW RED files, match highlight roll-off across exterior and interior shots, and deliver ProRes 4444 master.\n\nEnsure audio mix conforming is validated before final review delivery.",
                'priority' => 'urgent',
                'status' => 'in_progress',
                'start_date' => now()->toDateString(),
                'due_date' => now()->toDateString(),
                'estimate_hours' => 6.0,
                'spent_hours' => 3.5,
                'remaining_hours' => 2.5,
                'assigned_user_id' => $user->id,
                'created_by_user_id' => $user->id,
                'is_client_visible' => true,
                'dependencies_summary' => 'Sound mix delivery pending approval',
            ]);

            $task1->checklists()->createMany([
                ['title' => 'Conform RAW RED camera media', 'is_completed' => true, 'completed_at' => now(), 'sort_order' => 0],
                ['title' => 'Shot-matching across scenes', 'is_completed' => true, 'completed_at' => now(), 'sort_order' => 1],
                ['title' => 'Client hero look grade', 'is_completed' => false, 'completed_at' => null, 'sort_order' => 2],
                ['title' => 'Export ProRes 4444 delivery copy', 'is_completed' => false, 'completed_at' => null, 'sort_order' => 3],
            ]);

            $task1->comments()->createMany([
                [
                    'user_id' => $user->id,
                    'content' => 'Client requested warmer tones in the closing hero frame.',
                    'visibility' => 'internal',
                ],
                [
                    'user_id' => $user->id,
                    'content' => 'Version 2 draft is ready for preliminary client feedback.',
                    'visibility' => 'client',
                ],
            ]);

            $task1->timeLogs()->create([
                'user_id' => $user->id,
                'hours' => 3.5,
                'notes' => 'Conforming RED footage and primary scene matching pass',
                'logged_at' => now()->subHours(2),
            ]);

            // Task 2
            $task2 = Task::create([
                'organization_id' => $organization->id,
                'client_id' => $apex->id,
                'project_id' => $proj2->id,
                'client_name' => $apex->name,
                'project_name' => $proj2->name,
                'title' => 'Edit 3 viral hook variants for TikTok campaign deliverable',
                'brief' => 'Create three 5-second opening variations designed for high retention A/B testing on TikTok.',
                'priority' => 'high',
                'status' => 'todo',
                'start_date' => now()->toDateString(),
                'due_date' => now()->addDay()->toDateString(),
                'estimate_hours' => 4.0,
                'spent_hours' => 0.0,
                'remaining_hours' => 4.0,
                'assigned_user_id' => $user->id,
                'created_by_user_id' => $user->id,
                'is_client_visible' => false,
            ]);

            $task2->checklists()->createMany([
                ['title' => 'Cut Hook A (Pacing focus)', 'is_completed' => false, 'sort_order' => 0],
                ['title' => 'Cut Hook B (Shock value)', 'is_completed' => false, 'sort_order' => 1],
                ['title' => 'Cut Hook C (Question prompt)', 'is_completed' => false, 'sort_order' => 2],
            ]);

            // Task 3 (Upcoming)
            Task::create([
                'organization_id' => $organization->id,
                'client_id' => $pulse->id,
                'project_id' => $proj3->id,
                'client_name' => $pulse->name,
                'project_name' => $proj3->name,
                'title' => 'Export approved SVG tokens and typography styleguide for dev team',
                'brief' => 'Deliver finalized color and font JSON tokens to the client engineering repository.',
                'priority' => 'normal',
                'status' => 'todo',
                'start_date' => now()->addDays(2)->toDateString(),
                'due_date' => now()->addDays(4)->toDateString(),
                'estimate_hours' => 2.0,
                'spent_hours' => 0.0,
                'remaining_hours' => 2.0,
                'assigned_user_id' => $user->id,
                'created_by_user_id' => $user->id,
                'is_client_visible' => true,
            ]);

            // Task 4 (Blocked)
            Task::create([
                'organization_id' => $organization->id,
                'client_id' => $strata->id,
                'project_id' => $proj4->id,
                'client_name' => $strata->name,
                'project_name' => $proj4->name,
                'title' => 'Resolve canonical tag conflicts on checkout subpaths',
                'brief' => 'Fix self-referencing canonical discrepancies flagged during the automated crawl.',
                'priority' => 'urgent',
                'status' => 'blocked',
                'start_date' => now()->subDays(5)->toDateString(),
                'due_date' => now()->subDay()->toDateString(),
                'estimate_hours' => 5.0,
                'spent_hours' => 2.0,
                'remaining_hours' => 3.0,
                'assigned_user_id' => $user->id,
                'created_by_user_id' => $user->id,
                'is_client_visible' => true,
                'dependencies_summary' => 'Awaiting client staging access credentials',
            ]);

            // Task 5 (In Review)
            Task::create([
                'organization_id' => $organization->id,
                'client_id' => $luminary->id,
                'project_id' => $proj5->id,
                'client_name' => $luminary->name,
                'project_name' => $proj5->name,
                'title' => '12x Instagram Story asset packaging',
                'brief' => 'Package design deliverables and export PNG assets for social publishing.',
                'priority' => 'normal',
                'status' => 'review',
                'start_date' => now()->subDays(2)->toDateString(),
                'due_date' => now()->subDays(1)->toDateString(),
                'estimate_hours' => 3.5,
                'spent_hours' => 3.0,
                'remaining_hours' => 0.5,
                'assigned_user_id' => $user->id,
                'created_by_user_id' => $user->id,
                'is_client_visible' => true,
            ]);
        }
    }
}
