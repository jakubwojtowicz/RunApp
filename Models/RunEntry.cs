namespace RunApp.Models
{
    public class RunEntry
    {
        public DateOnly Date { get; set; }
        public double DistanceKm { get; set; }
        public TimeSpan Duration { get; set; }
        public string? Description { get; set; }
        public int WeekNumber { get; set; }
        public int TrainingNumberInWeek { get; set; }
    }
}
