using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RunApp.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTrainingPlanEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCurrent",
                table: "TrainingPlans",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCurrent",
                table: "TrainingPlans");
        }
    }
}
