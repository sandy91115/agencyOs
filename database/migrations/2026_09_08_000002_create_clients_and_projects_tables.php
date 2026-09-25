<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('status')->default('active'); // active, onboarding, at_risk, churned
            $table->string('health')->default('healthy'); // healthy, at_risk, critical
            $table->string('health_reason')->nullable();
            $table->json('services')->nullable();
            $table->bigInteger('monthly_retainer_cents')->default(0);
            $table->integer('margin_percent')->default(0);
            $table->string('lead_contact_name')->nullable();
            $table->string('lead_contact_email')->nullable();
            $table->foreignId('owner_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'slug']);
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('status')->default('in_progress'); // planning, in_progress, review, at_risk, completed
            $table->string('health')->default('on_track'); // on_track, at_risk, critical
            $table->string('health_reason')->nullable();
            $table->string('billing_type')->default('retainer'); // retainer, fixed, time_and_materials
            $table->decimal('budget_hours', 8, 2)->default(0);
            $table->decimal('spent_hours', 8, 2)->default(0);
            $table->decimal('remaining_hours', 8, 2)->default(0);
            $table->bigInteger('budget_cents')->default(0);
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->foreignId('lead_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['organization_id', 'status']);
            $table->index(['client_id', 'status']);
        });

        Schema::table('tasks', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('organization_id')->constrained('clients')->nullOnDelete();
            $table->foreignId('project_id')->nullable()->after('client_id')->constrained('projects')->nullOnDelete();

            $table->index(['organization_id', 'project_id']);
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['client_id']);
            $table->dropForeign(['project_id']);
            $table->dropColumn(['client_id', 'project_id']);
        });

        Schema::dropIfExists('projects');
        Schema::dropIfExists('clients');
    }
};
