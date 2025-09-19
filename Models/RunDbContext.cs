using Microsoft.EntityFrameworkCore;

namespace RunApp.Models
{
    public class RunDbContext : DbContext
    {
        public RunDbContext(DbContextOptions<RunDbContext> options) : base(options)
        {
        }
        public DbSet<Run> Runs { get; set; }
        public DbSet<RunType> RunTypes { get; set; }
        public DbSet<TrainingPlan> TrainingPlans { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Runs table properties

            modelBuilder.Entity<Run>()
                .Property(r => r.DistanceKm)
                .IsRequired();
            modelBuilder.Entity<Run>()
                .Property(r => r.Date)
                .HasConversion(
                    v => v.ToDateTime(TimeOnly.MinValue),
                    v => DateOnly.FromDateTime(v));
            modelBuilder.Entity<Run>()
                .Property(r => r.Duration)
                .IsRequired();
            modelBuilder.Entity<Run>()
                .Property(r => r.Notes)
                .HasMaxLength(200);
            modelBuilder.Entity<Run>()
                .Property(r => r.IsCompleted)
                .IsRequired();

            //RunTypes table properties

            modelBuilder.Entity<RunType>()
                .Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(20);

            modelBuilder.Entity<RunType>().HasData(
                new RunType { Id = 1, Name = "Recovery Run" },
                new RunType { Id = 2, Name = "Tempo Run" },
                new RunType { Id = 3, Name = "Easy Run" },
                new RunType { Id = 4, Name = "Long Run" }
            );

            //TrainingPlans table properties

            modelBuilder.Entity<TrainingPlan>()
                .Property(r => r.Name)
                .IsRequired()
                .HasMaxLength(50);
            modelBuilder.Entity<TrainingPlan>()
                .Property(r => r.Description)
                .HasMaxLength(200);
            modelBuilder.Entity<TrainingPlan>()
                .Property(r => r.IsCurrent)
                .IsRequired();
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
    }
}
