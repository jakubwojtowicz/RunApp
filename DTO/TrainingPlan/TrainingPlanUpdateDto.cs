using System.ComponentModel.DataAnnotations;

namespace RunApp.DTO.TrainingPlan
{
    public class TrainingPlanCreateDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
        [Required]
        [MaxLength(200)]
        public string Description { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public bool IsCurrent { get; set; }
    }
}
