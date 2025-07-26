using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunApp.DTO.Run;
using RunApp.DTO.TrainingPlan;
using RunApp.Exceptions;
using RunApp.Models;

namespace RunApp.Services
{
    public interface ITrainingPlanService
    {
        IEnumerable<TrainingPlanDto> GetAll();
        TrainingPlanDto GetCurrent();
        TrainingPlanDto GetById(int id);
        int Add(TrainingPlanCreateDto planDto);
        void Delete(int id);
        void Update(int trainingPlanId, TrainingPlanUpdateDto dto);
    }

    public class TrainingPlanService : ITrainingPlanService
    {
        private readonly RunDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ILogger<TrainingPlanService> _logger;

        public TrainingPlanService(RunDbContext dbContext, IMapper mapper, ILogger<TrainingPlanService> logger)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _logger = logger;
        }

        public IEnumerable<TrainingPlanDto> GetAll()
        {
            var plans = _dbContext.TrainingPlans
                .Include(p => p.Runs)
                .ToList();

            if (plans.Count == 0) throw new NotFoundException("TrainingPlans not found.");

            var plansDto = _mapper.Map<List<TrainingPlanDto>>(plans);

            return plansDto;
        }

        public TrainingPlanDto GetCurrent()
        {
            var plan = _dbContext.TrainingPlans
                .Include(p => p.Runs)
                .FirstOrDefault(p => p.IsCurrent == true);

            if (plan is null) throw new NotFoundException("Current training plan doesn't exist.");

            var trainingPlanDto = _mapper.Map<TrainingPlanDto>(plan);

            return trainingPlanDto;
        }

        public TrainingPlanDto GetById(int id)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == id);

            if (plan is null) throw new NotFoundException($"Training plan with Id: {id} not found.");

            var trainingPlanDto = _mapper.Map<TrainingPlanDto>(plan);

            return trainingPlanDto;
        }

        public int Add(TrainingPlanCreateDto planDto)
        {
            var current = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.IsCurrent == true);

            if (current != null && planDto.IsCurrent == true)
            {
                _logger.LogWarning($"Setting new current training plan.");
                current.IsCurrent = false;
            }

            var plan = _mapper.Map<TrainingPlan>(planDto);

            _dbContext.TrainingPlans.Add(plan);
            _dbContext.SaveChanges();

            return plan.Id;
        }

        public void Delete(int id)
        {
            _logger.LogWarning($"TrainingPlan with id {id} DELETE action invoked.");

            var plan = _dbContext.TrainingPlans.Find(id);
            if (plan is null) throw new NotFoundException($"Training plan with Id: {id} not found.");

            _dbContext.TrainingPlans.Remove(plan);
            _dbContext.SaveChangesAsync();
        }

        public void Update(int trainingPlanId, TrainingPlanUpdateDto dto)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException($"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

            plan.Name = dto.Name;
            plan.Description = dto.Description;
            plan.StartDate = dto.StartDate;
            plan.EndDate = dto.EndDate;

            if (dto.IsCurrent)
            {
                _logger.LogWarning($"TrainingPlan with id: {trainingPlanId} setting as new current plan.");
                var currentPlan = _dbContext.TrainingPlans
                    .FirstOrDefault(p => p.IsCurrent == true);
                if(currentPlan is not null)
                    currentPlan.IsCurrent = false;
            }

            plan.IsCurrent = dto.IsCurrent;

            _dbContext.SaveChanges();
        }
    }
}
