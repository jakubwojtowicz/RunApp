using RunApp.Models;

namespace RunApp.DTO.Run
{
    public class RunCreateDto
    {
        public DateOnly Date { get; set; }
        public RunPlace Place { get; set; }
        public double DistanceKm { get; set; }
        public TimeSpan Duration { get; set; }
        public string Description { get; set; }
        public int WeekNumber { get; set; }
        public int TrainingNumberInWeek { get; set; }
        public bool IsCompleted { get; set; }
        public int TrainingPlanId { get; set; }
    }
}
