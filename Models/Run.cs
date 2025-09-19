using System.Text.Json.Serialization;

namespace RunApp.Models
{
    public class Run
    {
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public int RunTypeId { get; set; }
        public virtual RunType RunType { get; set; }
        public required double DistanceKm { get; set; }
        public required TimeSpan Duration { get; set; }
        public TimeSpan? AverageSpeed { get; set; }
        public TimeSpan? TopSpeed { get; set; }
        public TimeSpan? MinimumSpeed { get; set; }
        public string? Notes { get; set; }
        public int? HeartRate { get; set; }
        public bool IsCompleted { get; set; }
        public int TrainingPlanId { get; set; }
        public virtual TrainingPlan TrainingPlan { get; set; }
    }
}
