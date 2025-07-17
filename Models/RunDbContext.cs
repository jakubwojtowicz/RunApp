using Microsoft.EntityFrameworkCore;

namespace RunApp.Models
{
    public class RunDbContext : DbContext
    {
        private string _connectionString = "Data Source=runapp.db";
        public DbSet<Run> Runs { get; set; }
        public DbSet<TrainingPlan> TrainingPlans { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Run>()
                .Property(r => r.Description)
                .IsRequired()
                .HasMaxLength(200);
            modelBuilder.Entity<Run>()
                .Property(r => r.WeekNumber)
                .IsRequired();
            modelBuilder.Entity<Run>()
                .Property(r => r.TrainingNumberInWeek)
                .IsRequired();
            modelBuilder.Entity<Run>()
                .Property(r => r.Place)
                .HasMaxLength(150);
            modelBuilder.Entity<Run>()
                .Property(r => r.Date)
                .HasConversion(
                    v => v.ToDateTime(TimeOnly.MinValue),
                    v => DateOnly.FromDateTime(v));

            modelBuilder.Entity<TrainingPlan>()
                .Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(50);
            modelBuilder.Entity<TrainingPlan>()
                .Property(r => r.StartDate)
                .HasConversion(
                    v => v.ToDateTime(TimeOnly.MinValue),
                    v => DateOnly.FromDateTime(v));
            modelBuilder.Entity<TrainingPlan>()
                .Property(r => r.EndDate)
                .HasConversion(
                    v => v.ToDateTime(TimeOnly.MinValue),
                    v => DateOnly.FromDateTime(v));

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(_connectionString);
        }
    }
}
