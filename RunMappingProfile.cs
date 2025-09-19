using AutoMapper;
using Microsoft.EntityFrameworkCore.Sqlite.Storage.Internal;
using RunApp.DTO.Run;
using RunApp.DTO.TrainingPlan;
using RunApp.Models;

namespace RunApp
{
    public class RunMappingProfile : Profile
    {
        public RunMappingProfile()
        {
            CreateMap<Run, RunDto>()
                .ForMember(dest => dest.RunType,
                            opt => opt.MapFrom(src => src.RunType.Name));
            CreateMap<TrainingPlan, TrainingPlanDto>();
            CreateMap<TrainingPlanCreateDto, TrainingPlan>();
            CreateMap<RunCreateDto, Run>();
        }
    }
}
