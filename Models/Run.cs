using System.Text.Json.Serialization;

namespace RunApp.Models
{
    public enum RunPlace
    {
        Outdoor,
        Treadmill
    }
    public class Run
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
