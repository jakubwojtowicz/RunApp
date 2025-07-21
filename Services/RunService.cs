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
        RunDto GetLatestRun(int trainingPlanId);
        int Add(int trainingPlanId, RunCreateDto dto);
        void Update(int trainingPlanId, RunUpdateDto dto);
        void Delete(int trainingPlanId, int id);
        object GetSummary(int trainingPlanId);
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

        public RunDto GetLatestRun(int trainingPlanId)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException($"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

            var latestRun = _dbContext.Runs
                .OrderByDescending(r => r.Date)
                .FirstOrDefault();

            if (latestRun is null || latestRun.TrainingPlanId != trainingPlanId) 
                throw new NotFoundException("Run not found.");

            var runDto = _mapper.Map<RunDto>(latestRun);

            return runDto;
        }

        public int Add(int trainingPlanId, RunCreateDto dto)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException($"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

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
            run.Place = dto.Place;
            run.DistanceKm = dto.DistanceKm;
            run.Duration = dto.Duration;
            run.Description = dto.Description;
            run.WeekNumber = dto.WeekNumber;
            run.TrainingNumberInWeek = dto.TrainingNumberInWeek;
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

        public object GetSummary(int trainingPlanId)
        {
            var plan = _dbContext.
                TrainingPlans
                .Include(p => p.Runs)
                .FirstOrDefault(p => p.Id == trainingPlanId);

            if (plan is null)
                throw new NotFoundException(
                    $"Training plan with the id: {trainingPlanId} doesn't exist in the database.");

            var runs = plan.Runs
                .Where(r => r.IsCompleted)
                .ToList();

            var totalDistance = runs.Sum(r => r.DistanceKm);
            var totalDuration = runs.Aggregate(TimeSpan.Zero, (acc, r) => (TimeSpan)(acc + r.Duration));

            TimeSpan avgPace = totalDistance > 0
                ? TimeSpan.FromSeconds((double)(totalDuration.TotalSeconds / totalDistance))
                : TimeSpan.Zero;

            return new
            {
                totalDistance,
                totalDuration = totalDuration.ToString(@"hh\:mm\:ss"),
                avgPace = avgPace.ToString(@"mm\:ss")
            };
        }

    }
}
