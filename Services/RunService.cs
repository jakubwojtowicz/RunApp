using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RunApp.DTO.Run;
using RunApp.Exceptions;
using RunApp.Models;

namespace RunApp.Services
{
    public interface IRunService
    {
        RunDto GetById(int trainingPlanId, int id);
        IEnumerable<RunDto> GetAll(int trainingPlanId);
        int Add(int trainingPlanId, RunCreateDto dto);
        void Update(int trainingPlanId, RunUpdateDto dto);
        void Delete(int trainingPlanId, int id);
    }

    public class RunService : IRunService
    {
        private readonly RunDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly ILogger<RunService> _logger;

        public RunService(RunDbContext dbContext, IMapper mapper, ILogger<RunService> logger)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _logger = logger;
        }

        public RunDto GetById(int trainingPlanId, int id)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException($"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

            var run = _dbContext
                .Runs
                .FirstOrDefault(r => r.Id == id);

            if (run is null || run.TrainingPlanId != trainingPlanId)
                throw new NotFoundException("Run not found.");

            var runDto = _mapper.Map<RunDto>(run);

            return runDto;
        }

        public IEnumerable<RunDto> GetAll(int trainingPlanId)
        {
            var plan = _dbContext.
                TrainingPlans
                .Include(p => p.Runs)
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException(
                    $"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

            var runsDto = _mapper.Map<List<RunDto>>(plan.Runs);

            return runsDto;
        }

        public int Add(int trainingPlanId, RunCreateDto dto)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException($"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

            var runType = _dbContext.RunTypes
                .FirstOrDefault(p => p.Id == dto.RunTypeId);

            if (runType is null)
                throw new NotFoundException($"Run Type with the id: {dto.RunTypeId} doesn't exist in the database.");

            var run = _mapper.Map<Run>(dto);
            _dbContext.Runs.Add(run);
            _dbContext.SaveChanges();

            return run.Id;
        }

        public void Update(int trainingPlanId, RunUpdateDto dto)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException($"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

            var run = _dbContext
                .Runs
                .FirstOrDefault(r => r.Id == dto.Id);

            if (run is null || run.TrainingPlanId != trainingPlanId)
                throw new NotFoundException("Run not found.");

            run.Date = dto.Date;
            run.DistanceKm = dto.DistanceKm;
            run.Duration = dto.Duration;
            run.Notes = dto.Notes;
            run.HeartRate = dto.HeartRate;
            run.AverageSpeed = dto.AverageSpeed;
            run.MinimumSpeed = dto.MinimumSpeed;
            run.TopSpeed = dto.TopSpeed;
            run.IsCompleted = dto.IsCompleted;

            _dbContext.SaveChanges();
        }

        public void Delete(int trainingPlanId, int id)
        {
            _logger.LogWarning($"Run with id {id} DELETE action invoked.");

            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException($"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

            var run = _dbContext
                .Runs
                .FirstOrDefault(r => r.Id == id);

            if (run is null || run.TrainingPlanId != trainingPlanId)
                throw new NotFoundException("Run not found.");

            _dbContext.Runs.Remove(run);
            _dbContext.SaveChanges();
        }
    }
}
