using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RunApp.DTO.Run;
using RunApp.Models;

namespace RunApp.Services
{
    public interface IRunService
    {
        RunDto GetById(int id);
        IEnumerable<RunDto> GetByTrainingPlan(int trainingPlanId);
        IEnumerable<RunDto> GetAll();
        RunDto GetLatestRun();
        int Add(RunCreateDto dto);
        bool Update(RunUpdateDto dto);
        bool Delete(int id);
        object GetSummary();
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

        public RunDto GetById(int id)
        {
            var run = _dbContext
                .Runs
                .Include(r => r.TrainingPlan)
                .FirstOrDefault(r => r.Id == id);

            if (run is null) return null;
               
            var runDto = _mapper.Map<RunDto>(run);

            return runDto;
        }

        public IEnumerable<RunDto> GetByTrainingPlan(int trainingPlanId)
        {
            var runs = _dbContext.Runs
                .Where(r => r.TrainingPlanId == trainingPlanId)
                .Include(r => r.TrainingPlan)
                .ToList();

            var runsDto = _mapper.Map<List<RunDto>>(runs);

            return runsDto;
        }

        public IEnumerable<RunDto> GetAll()
        {
            var runs = _dbContext
                .Runs
                .Include(r => r.TrainingPlan)
                .ToList();

            var runsDto = _mapper.Map<List<RunDto>>(runs);

            return runsDto;
        }

        public RunDto GetLatestRun()
        {
            var latestRun = _dbContext.Runs
                .OrderByDescending(r => r.Date)
                .FirstOrDefault();

            if (latestRun == null) return null;

            var runDto = _mapper.Map<RunDto>(latestRun);

            return runDto;
        }

        public int Add(RunCreateDto dto)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == dto.TrainingPlanId);

            if (plan == null)
                throw new Exception($"Training plan with the id: {dto.TrainingPlanId} doesn't exist in the database.");

            var run = _mapper.Map<Run>(dto);
            _dbContext.Runs.Add(run);
            _dbContext.SaveChanges();

            return run.Id;
        }

        public bool Update(RunUpdateDto dto)
        {
            var run = _dbContext.Runs.Find(dto.Id);

            if (run == null)
            {
                return false;
            }

            run.Date = dto.Date;
            run.Place = dto.Place;
            run.DistanceKm = dto.DistanceKm;
            run.Duration = dto.Duration;
            run.Description = dto.Description;
            run.WeekNumber = dto.WeekNumber;
            run.TrainingNumberInWeek = dto.TrainingNumberInWeek;
            run.IsCompleted = dto.IsCompleted;

            _dbContext.SaveChanges();
            return true;
        }

        public bool Delete(int id)
        {
            _logger.LogWarning($"Run with id {id} DELETE action invoked.");

            var run = _dbContext.Runs.Find(id);

            if (run == null)
                return false;

            _dbContext.Runs.Remove(run);
            _dbContext.SaveChanges();

            return true;
        }

        public object GetSummary()
        {
            var runs = _dbContext.Runs
                .Where(r => r.IsCompleted)
                .ToList();

            if (runs.Count == 0)
            {
                throw new Exception($"Completed runs not found in the database.");
            }

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
