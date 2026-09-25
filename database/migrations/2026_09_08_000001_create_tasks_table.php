<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('client_name')->default('General');
            $table->string('project_name')->default('Operations');
            $table->string('title');
            $table->text('brief')->nullable();
            $table->string('priority')->default('normal'); // urgent, high, normal, low
            $table->string('status')->default('todo'); // todo, in_progress, review, blocked, completed
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->decimal('estimate_hours', 8, 2)->default(0);
            $table->decimal('spent_hours', 8, 2)->default(0);
            $table->decimal('remaining_hours', 8, 2)->default(0);
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_client_visible')->default(false);
            $table->string('dependencies_summary')->nullable();
            $table->timestamps();

            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'assigned_user_id']);
        });

        Schema::create('task_checklists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->string('title');
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['task_id', 'sort_order']);
        });

        Schema::create('task_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('content');
            $table->string('visibility')->default('internal'); // internal, client
            $table->timestamps();

            $table->index(['task_id', 'visibility']);
        });

        Schema::create('task_time_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('hours', 8, 2);
            $table->string('notes')->nullable();
            $table->timestamp('logged_at')->useCurrent();
            $table->timestamps();

            $table->index(['task_id', 'logged_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_time_logs');
        Schema::dropIfExists('task_comments');
        Schema::dropIfExists('task_checklists');
        Schema::dropIfExists('tasks');
    }
};
