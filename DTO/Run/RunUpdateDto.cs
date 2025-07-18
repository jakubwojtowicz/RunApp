using RunApp.Models;
using System.Text.Json.Serialization;

namespace RunApp.DTO.Run
{
    public class RunUpdateDto
    {
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        public string Place { get; set; }
        public double DistanceKm { get; set; }
        public TimeSpan Duration { get; set; }
        public string Description { get; set; }
        public int WeekNumber { get; set; }
        public int TrainingNumberInWeek { get; set; }
        public bool IsCompleted { get; set; }
    }
}
