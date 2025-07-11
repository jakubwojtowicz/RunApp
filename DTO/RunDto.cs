using RunApp.Models;
using System.Text.Json.Serialization;

namespace RunApp.DTO
{
    public class RunDto
    {
        public DateOnly Date { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public RunPlace Place { get; set; }
        public double DistanceKm { get; set; }
        public TimeSpan Duration { get; set; }
        public string? Description { get; set; }
        public int WeekNumber { get; set; }
        public int TrainingNumberInWeek { get; set; }
    }
}
