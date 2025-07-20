using AutoMapper;
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
        private readonly IMapper _mapper;

        public TrainingPlanController(RunDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TrainingPlanDto>>> GetAll()
        {
            var plans = await _context.TrainingPlans
                .Include(p => p.Runs)
                .ToListAsync();

            var plansDto = _mapper.Map<List<TrainingPlanDto>>(plans);

            return Ok(plansDto);
        }

        [HttpGet("current")]
        public async Task<ActionResult<TrainingPlanDto>> GetCurrent()
        {
            var plan = await _context.TrainingPlans
                .Include(p => p.Runs)
                .Where(p => p.IsCurrent == true)
                .FirstOrDefaultAsync();

            if (plan == null)
                return NotFound();

            var trainingPlanDto = _mapper.Map<TrainingPlanDto>(plan);

            return Ok(trainingPlanDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var plan = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.Id == id);

            if (plan == null)
                return NotFound();

            var trainingPlanDto = _mapper.Map<TrainingPlanDto>(plan);

            return Ok(trainingPlanDto);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] TrainingPlanCreateDto planDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var current = await _context.TrainingPlans
                .FirstOrDefaultAsync(p => p.IsCurrent == true);

            if(current != null && planDto.IsCurrent == true)
            {
                return BadRequest("Cannot create second current training plan.");
            }

            var plan = _mapper.Map<TrainingPlan>(planDto);

            _context.TrainingPlans.Add(plan);
            await _context.SaveChangesAsync();

            return CreatedAtAction($"/api/trainingplan/{plan.Id}", null);
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
