using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunApp.DTO.Run;
using RunApp.Models;

namespace RunApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RunController : ControllerBase
    {
        private readonly RunDbContext _context;

        public RunController(RunDbContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RunDto>> GetById(int id)
        {
            var run = await _context.Runs.FindAsync(id);

            if (run == null)
                return NotFound();

            return Ok(run);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] RunCreateDto dto)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == dto.TrainingPlanId);

            if (plan == null)
                return NotFound($"Training plan with the id: {dto.TrainingPlanId} doesn't exist in the database.");

            var run = new Run
            {
                Date = dto.Date,
                Place = dto.Place,
                DistanceKm = dto.DistanceKm,
                Duration = dto.Duration,
                Description = dto.Description,
                WeekNumber = dto.WeekNumber,
                TrainingNumberInWeek = dto.TrainingNumberInWeek,
                IsCompleted = dto.IsCompleted,
                TrainingPlanId = dto.TrainingPlanId
            };

            _context.Runs.Add(run);
            await _context.SaveChangesAsync();

            var runDto = new RunDto
            {
                Id = run.Id,
                Date = run.Date,
                Place = run.Place,
                DistanceKm = run.DistanceKm,
                Duration = run.Duration,
                Description = run.Description,
                WeekNumber = run.WeekNumber,
                TrainingNumberInWeek = run.TrainingNumberInWeek,
                IsCompleted = run.IsCompleted,
                TrainingPlanId = run.TrainingPlanId
            };

            return CreatedAtAction(nameof(GetById), new { id = run.Id }, runDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RunDto>>> Get()
        {
            var runs = await _context.Runs
                .Include(r => r.TrainingPlan)
                .ToListAsync();

            var result = runs.Select(r => new RunDto
            {
                Id = r.Id,
                Date = r.Date,
                Place = r.Place,
                DistanceKm = r.DistanceKm,
                Duration = r.Duration,
                Description = r.Description,
                WeekNumber = r.WeekNumber,
                TrainingNumberInWeek = r.TrainingNumberInWeek,
                IsCompleted = r.IsCompleted,
                TrainingPlanId = r.TrainingPlanId
            });

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var run = await _context.Runs.FindAsync(id);
            if (run == null)
                return NotFound("Run entry not found.");

            _context.Runs.Remove(run);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestRun()
        {
            var latestRun = await _context.Runs
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (latestRun == null)
                return NotFound("No runs found.");

            var latestRunDto = new RunDto
            {
                Id = latestRun.Id,
                Date = latestRun.Date,
                Place = latestRun.Place,
                DistanceKm = latestRun.DistanceKm,
                Duration = latestRun.Duration,
                Description = latestRun.Description,
                IsCompleted = latestRun.IsCompleted, 
                TrainingPlanId = latestRun.TrainingPlanId
            };

            return Ok(latestRunDto);
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var runs = await _context.Runs
                .Where(r => r.IsCompleted) 
                .ToListAsync();

            if(runs.Count == 0)
            {
                return NotFound("Completed runs not found in the database.");
            }

            var totalDistance = runs.Sum(r => r.DistanceKm);
            var totalDuration = runs.Aggregate(TimeSpan.Zero, (acc, r) => acc + r.Duration);

            TimeSpan avgPace = totalDistance > 0
                ? TimeSpan.FromSeconds(totalDuration.TotalSeconds / totalDistance)
                : TimeSpan.Zero;

            return Ok(new
            {
                totalDistance,
                totalDuration = totalDuration.ToString(@"hh\:mm\:ss"),
                avgPace = avgPace.ToString(@"mm\:ss")
            });
        }

        [HttpGet("by-plan/{trainingPlanId}")]
        public async Task<IActionResult> GetByTrainingPlan(int trainingPlanId)
        {
            var runs = await _context.Runs
                .Where(r => r.TrainingPlanId == trainingPlanId)
                .ToListAsync();

            var result = runs.Select(r => new RunDto
            {
                Id = r.Id,
                Date = r.Date,
                Place = r.Place,
                DistanceKm = r.DistanceKm,
                Duration = r.Duration,
                Description = r.Description,
                WeekNumber = r.WeekNumber,
                TrainingNumberInWeek = r.TrainingNumberInWeek,
                IsCompleted = r.IsCompleted,
                TrainingPlanId = r.TrainingPlanId
            });

            return Ok(result);
        }
    }
}
