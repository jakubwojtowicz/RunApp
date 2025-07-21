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
        RunDto GetById(int id);
        IEnumerable<RunDto> GetByTrainingPlan(int trainingPlanId);
        IEnumerable<RunDto> GetAll();
        RunDto GetLatestRun();
        int Add(RunCreateDto dto);
        void Update(RunUpdateDto dto);
        void Delete(int id);
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

            if (run is null) 
                throw new NotFoundException("Run not found."); 
               
            var runDto = _mapper.Map<RunDto>(run);

            return runDto;
        }

        public IEnumerable<RunDto> GetByTrainingPlan(int trainingPlanId)
        {
            var runs = _dbContext.Runs
                .Where(r => r.TrainingPlanId == trainingPlanId)
                .Include(r => r.TrainingPlan)
                .ToList();

            if (runs.Count == 0) 
                throw new NotFoundException("Runs not found.");

            var runsDto = _mapper.Map<List<RunDto>>(runs);

            return runsDto;
        }

        public IEnumerable<RunDto> GetAll()
        {
            var runs = _dbContext
                .Runs
                .Include(r => r.TrainingPlan)
                .ToList();

            if (runs.Count == 0) 
                throw new NotFoundException("Runs not found.");

            var runsDto = _mapper.Map<List<RunDto>>(runs);

            return runsDto;
        }

        public RunDto GetLatestRun()
        {
            var latestRun = _dbContext.Runs
                .OrderByDescending(r => r.Date)
                .FirstOrDefault();

            if (latestRun is null) 
                throw new NotFoundException("Run not found.");

            var runDto = _mapper.Map<RunDto>(latestRun);

            return runDto;
        }

        public int Add(RunCreateDto dto)
        {
            var plan = _dbContext.TrainingPlans
                .FirstOrDefault(p => p.Id == dto.TrainingPlanId);

            if (plan is null)
                throw new BadRequestException($"Training plan with the id: {dto.TrainingPlanId} doesn't exist in the database.");

            var run = _mapper.Map<Run>(dto);
            _dbContext.Runs.Add(run);
            _dbContext.SaveChanges();

            return run.Id;
        }

        public void Update(RunUpdateDto dto)
        {
            var run = _dbContext.Runs.Find(dto.Id);

            if (run is null)
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

        public void Delete(int id)
        {
            _logger.LogWarning($"Run with id {id} DELETE action invoked.");

            var run = _dbContext.Runs.Find(id);

            if (run is null)
                throw new NotFoundException("Run not found.");

            _dbContext.Runs.Remove(run);
            _dbContext.SaveChanges();
        }

        public object GetSummary()
        {
            var runs = _dbContext.Runs
                .Where(r => r.IsCompleted)
                .ToList();

            if (runs.Count == 0)
                throw new NotFoundException("Completed runs not found.");

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
