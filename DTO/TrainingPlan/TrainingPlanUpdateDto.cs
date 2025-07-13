namespace RunApp.DTO.TrainingPlan
{
    public class TrainingPlanUpdateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
    }
}
