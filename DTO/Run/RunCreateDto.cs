using RunApp.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RunApp.DTO.Run
{
    public class RunCreateDto
    {
        public DateOnly Date { get; set; }
        public int RunTypeId { get; set; }
        public double DistanceKm { get; set; }
        public TimeSpan? Duration { get; set; }
        public TimeSpan? AverageSpeed { get; set; }
        public TimeSpan? TopSpeed { get; set; }
        public TimeSpan? MinimumSpeed { get; set; }
        [MaxLength(200)]
        public string? Notes { get; set; }
        public int HeartRate { get; set; }
        public bool IsCompleted { get; set; }
        public int TrainingPlanId { get; set; }
    }
}
