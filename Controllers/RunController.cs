using AutoMapper;
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
        private readonly IMapper _mapper;

        public RunController(RunDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RunDto>>> GetAll()
        {
            var runs = await _context
                .Runs
                .Include(r => r.TrainingPlan)
                .ToListAsync();

            var runsDto = _mapper.Map<List<RunDto>>(runs);

            return Ok(runsDto);
        }

        [HttpGet("by-plan/{trainingPlanId}")]
        public async Task<ActionResult<IEnumerable<RunDto>>> GetByTrainingPlan(int trainingPlanId)
        {
            var runs = await _context.Runs
                .Where(r => r.TrainingPlanId == trainingPlanId)
                .Include(r => r.TrainingPlan)
                .ToListAsync();

            var runsDto = _mapper.Map<List<RunDto>>(runs);

            return Ok(runsDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RunDto>> GetById(int id)
        {
            var run = await _context
                .Runs
                .Include(r => r.TrainingPlan)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (run == null)
                return NotFound();

            var runDto = _mapper.Map<RunDto>(run);

            return Ok(runDto);
        }

        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestRun()
        {
            var latestRun = await _context.Runs
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (latestRun == null)
                return NotFound("No runs found.");

            var runDto = _mapper.Map<RunDto>(latestRun);

            return Ok(runDto);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] RunCreateDto dto)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == dto.TrainingPlanId);

            if (plan == null)
                return NotFound($"Training plan with the id: {dto.TrainingPlanId} doesn't exist in the database.");

            var run = _mapper.Map<Run>(dto);

            _context.Runs.Add(run);
            await _context.SaveChangesAsync();

            return CreatedAtAction($"/api/run/{run.Id}", null);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] RunUpdateDto dto)
        {
            var run = await _context.Runs.FindAsync(dto.Id);

            if (run == null)
            {
                return NotFound($"Run with ID {dto.Id} not found.");
            }

            run.Date = dto.Date;
            run.Place = dto.Place;
            run.DistanceKm = dto.DistanceKm;
            run.Duration = dto.Duration;
            run.Description = dto.Description;
            run.WeekNumber = dto.WeekNumber;
            run.TrainingNumberInWeek = dto.TrainingNumberInWeek;
            run.IsCompleted = dto.IsCompleted;

            await _context.SaveChangesAsync();

            return Ok(run);
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
            var totalDuration = runs.Aggregate(TimeSpan.Zero, (acc, r) => (TimeSpan)(acc + r.Duration));

            TimeSpan avgPace = totalDistance > 0
                ? TimeSpan.FromSeconds((double)(totalDuration.TotalSeconds / totalDistance))
                : TimeSpan.Zero;

            return Ok(new
            {
                totalDistance,
                totalDuration = totalDuration.ToString(@"hh\:mm\:ss"),
                avgPace = avgPace.ToString(@"mm\:ss")
            });
        }

    }
}
