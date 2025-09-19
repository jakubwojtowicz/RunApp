namespace RunApp.Models
{
    public class TrainingPlan
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set;}
        public virtual List<Run> Runs { get; set; }
        public required bool IsCurrent { get; set; }
    }
}
