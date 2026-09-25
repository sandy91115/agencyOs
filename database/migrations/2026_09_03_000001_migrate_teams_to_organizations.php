<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->dropForeign(['current_team_id']));
        Schema::table('team_members', fn (Blueprint $table) => $table->dropForeign(['team_id']));
        Schema::table('team_invitations', fn (Blueprint $table) => $table->dropForeign(['team_id']));

        Schema::rename('teams', 'organizations');
        Schema::rename('team_members', 'organization_members');
        Schema::rename('team_invitations', 'organization_invitations');

        Schema::table('users', fn (Blueprint $table) => $table->renameColumn('current_team_id', 'current_organization_id'));
        Schema::table('organization_members', fn (Blueprint $table) => $table->renameColumn('team_id', 'organization_id'));
        Schema::table('organization_invitations', fn (Blueprint $table) => $table->renameColumn('team_id', 'organization_id'));

        Schema::table('users', fn (Blueprint $table) => $table->foreign('current_organization_id')->references('id')->on('organizations')->nullOnDelete());
        Schema::table('organization_members', function (Blueprint $table) {
            $table->foreign('organization_id')->references('id')->on('organizations')->cascadeOnDelete();
        });
        Schema::table('organization_invitations', fn (Blueprint $table) => $table->foreign('organization_id')->references('id')->on('organizations')->cascadeOnDelete());
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->dropForeign(['current_organization_id']));
        Schema::table('organization_members', function (Blueprint $table) {
            $table->dropForeign(['organization_id']);
        });
        Schema::table('organization_invitations', fn (Blueprint $table) => $table->dropForeign(['organization_id']));

        Schema::table('users', fn (Blueprint $table) => $table->renameColumn('current_organization_id', 'current_team_id'));
        Schema::table('organization_members', fn (Blueprint $table) => $table->renameColumn('organization_id', 'team_id'));
        Schema::table('organization_invitations', fn (Blueprint $table) => $table->renameColumn('organization_id', 'team_id'));

        Schema::rename('organization_invitations', 'team_invitations');
        Schema::rename('organization_members', 'team_members');
        Schema::rename('organizations', 'teams');

        Schema::table('users', fn (Blueprint $table) => $table->foreign('current_team_id')->references('id')->on('teams')->nullOnDelete());
        Schema::table('team_members', function (Blueprint $table) {
            $table->foreign('team_id')->references('id')->on('teams')->cascadeOnDelete();
        });
        Schema::table('team_invitations', fn (Blueprint $table) => $table->foreign('team_id')->references('id')->on('teams')->cascadeOnDelete());
    }
};
