namespace RunApp.DTO.TrainingPlan
{
    public class TrainingPlanCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
