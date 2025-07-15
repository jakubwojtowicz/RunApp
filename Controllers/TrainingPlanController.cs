using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunApp.DTO.Run;
using RunApp.DTO.TrainingPlan;
using RunApp.Models;
using System;
using System.Numerics;
using System.Text;

namespace RunApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingPlanController : ControllerBase
    {
        private readonly RunDbContext _context;

        public TrainingPlanController(RunDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var plans = await _context.TrainingPlans
                .Include(p => p.Runs)
                .ToListAsync();

            var result = plans.Select(p => new TrainingPlanDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                Runs = p.Runs.Select(r => new RunDto
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
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrent()
        {
            var plan = await _context.TrainingPlans
                .Include(p => p.Runs)
                .Where(p => p.IsCurrent == true)
                .FirstOrDefaultAsync();

            if (plan == null)
                return NotFound();

            var result = new TrainingPlanDto
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Runs = plan.Runs.Select(r => new RunDto
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
                }).ToList(),
                IsCurrent = plan.IsCurrent
            };

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                return NotFound();

            var result = new TrainingPlanDto 
            {
                Id = plan.Id,
                Name = plan.Name,
                Description = plan.Description,
                StartDate = plan.StartDate,
                EndDate = plan.EndDate,
                Runs = plan.Runs.Select(r => new RunDto
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
                }).ToList()
            };

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] TrainingPlanUpdateDto planDto)
        {
            var current = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.IsCurrent == true);

            if(current != null && planDto.IsCurrent == true)
            {
                return BadRequest("Cannot create second current training plan.");
            }

            var plan = new TrainingPlan
            {
                Name = planDto.Name,
                Description = planDto.Description,
                StartDate = planDto.StartDate,
                EndDate = planDto.EndDate,
                IsCurrent = planDto.IsCurrent,
            };
            _context.TrainingPlans.Add(plan);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = plan.Id }, plan);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var plan = await _context.TrainingPlans.FindAsync(id);
            if (plan == null)
                return NotFound();

            _context.TrainingPlans.Remove(plan);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
