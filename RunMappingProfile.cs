using AutoMapper;
using RunApp.DTO.Run;
using RunApp.DTO.TrainingPlan;
using RunApp.Models;

namespace RunApp
{
    public class RunMappingProfile : Profile
    {
        public RunMappingProfile()
        {
            CreateMap<Run, RunDto>();
            CreateMap<TrainingPlan, TrainingPlanDto>();
            CreateMap<TrainingPlanCreateDto, TrainingPlan>();
            CreateMap<RunCreateDto, Run>();
        }
    }
}
