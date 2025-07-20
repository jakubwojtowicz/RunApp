using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunApp.DTO.TrainingPlan;
using RunApp.Models;

namespace RunApp.Services
{
    public interface ITrainingPlanService
    {
        IEnumerable<TrainingPlanDto> GetAll();
        TrainingPlanDto GetCurrent();
        TrainingPlanDto GetById(int id);
        int Add(TrainingPlanCreateDto planDto);
        bool Delete(int id);
    }

    public class TrainingPlanService : ITrainingPlanService
    {
        private readonly RunDbContext _dbContext;
        private readonly IMapper _mapper;

        public TrainingPlanService(RunDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public IEnumerable<TrainingPlanDto> GetAll()
        {
            var plans = _dbContext.TrainingPlans
                .Include(p => p.Runs)
                .ToList();

            var plansDto = _mapper.Map<List<TrainingPlanDto>>(plans);

            return plansDto;
        }

        public TrainingPlanDto GetCurrent()
        {
            var plan = _dbContext.TrainingPlans
                .Include(p => p.Runs)
                .FirstOrDefault(p => p.IsCurrent == true);

            if (plan is null) return null;

            var trainingPlanDto = _mapper.Map<TrainingPlanDto>(plan);

            return trainingPlanDto;
        }

        public TrainingPlanDto GetById(int id)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == id);

            if (plan is null) return null;

            var trainingPlanDto = _mapper.Map<TrainingPlanDto>(plan);

            return trainingPlanDto;
        }

        public int Add(TrainingPlanCreateDto planDto)
        {
            var current = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.IsCurrent == true);

            if (current != null && planDto.IsCurrent == true)
            {
                throw new Exception("Cannot create second current training plan.");
            }

            var plan = _mapper.Map<TrainingPlan>(planDto);

            _dbContext.TrainingPlans.Add(plan);
            _dbContext.SaveChanges();

            return plan.Id;
        }

        public bool Delete(int id)
        {
            var plan = _dbContext.TrainingPlans.Find(id);
            if (plan == null) return false;

            _dbContext.TrainingPlans.Remove(plan);
            _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
