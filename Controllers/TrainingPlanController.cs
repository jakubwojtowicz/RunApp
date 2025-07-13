using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunApp.DTO.TrainingPlan;
using RunApp.Models;
using System;

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
                .ToListAsync();

            return Ok(plans);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                return NotFound();

            return Ok(plan);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] TrainingPlanDto planDto)
        {
            var plan = new TrainingPlan
            {
                Name = planDto.Name,
                Description = planDto.Description,
                StartDate = planDto.StartDate,
                EndDate = planDto.EndDate
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
