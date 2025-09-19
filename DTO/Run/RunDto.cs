using RunApp.Models;
using System.Text.Json.Serialization;

namespace RunApp.DTO.Run
{
    public class RunDto
    {
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public string RunType { get; set; }
        public double DistanceKm { get; set; }
        public TimeSpan Duration { get; set; }
        public TimeSpan? AverageSpeed { get; set; }
        public TimeSpan? TopSpeed { get; set; }
        public TimeSpan? MinimumSpeed { get; set; }
        public string? Notes { get; set; }
        public int? HeartRate { get; set; }
        public bool IsCompleted { get; set; }
        public int TrainingPlanId { get; set; }
    }
}
