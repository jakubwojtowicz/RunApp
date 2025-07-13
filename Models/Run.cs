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
        public int Id { get; set; }
        public DateOnly Date { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public RunPlace Place { get; set; }
        public double DistanceKm { get; set; }
        public TimeSpan Duration { get; set; }
        public string Description { get; set; }
        public int WeekNumber { get; set; }
        public int TrainingNumberInWeek { get; set; }
        public bool IsCompleted { get; set; }
        public int TrainingPlanId { get; set; }
        public virtual TrainingPlan TrainingPlan { get; set; }
    }
}
