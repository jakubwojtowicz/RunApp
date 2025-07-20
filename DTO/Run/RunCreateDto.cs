using RunApp.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RunApp.DTO.Run
{
    public class RunCreateDto
    {
        public DateOnly Date { get; set; }
        [MaxLength(100)]
        public string Place { get; set; }
        public double? DistanceKm { get; set; }
        public TimeSpan? Duration { get; set; }
        [Required]
        [MaxLength(200)]
        public string Description { get; set; }
        [Required]
        public int WeekNumber { get; set; }
        [Required]
        public int TrainingNumberInWeek { get; set; }
        public bool IsCompleted { get; set; }
        public int TrainingPlanId { get; set; }
    }
}
