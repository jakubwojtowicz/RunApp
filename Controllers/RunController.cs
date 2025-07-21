using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunApp.DTO.Run;
using RunApp.Models;
using RunApp.Services;

namespace RunApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RunController : ControllerBase
    {
        private readonly IRunService _runService;

        public RunController(IRunService runService)
        {
            _runService = runService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<RunDto>> GetAll()
        {
            var runs = _runService.GetAll();

            return Ok(runs);
        }

        [HttpGet("by-plan/{trainingPlanId}")]
        public ActionResult<IEnumerable<RunDto>> GetByTrainingPlan(int trainingPlanId)
        {
            var runs = _runService.GetByTrainingPlan(trainingPlanId);

            return Ok(runs);
        }

        [HttpGet("{id}")]
        public ActionResult<RunDto> GetById(int id)
        {
            var run = _runService.GetById(id);

            return Ok(run);
        }

        [HttpGet("latest")]
        public ActionResult<RunDto> GetLatestRun()
        {
            var latestRun = _runService.GetLatestRun();

            return Ok(latestRun);
        }

        [HttpPost]
        public ActionResult Add([FromBody] RunCreateDto dto)
        {
            var id = _runService.Add(dto);

            return Created($"/api/run/{id}", null);
        }

        [HttpPut]
        public ActionResult Update([FromBody] RunUpdateDto dto)
        {
            _runService.Update(dto);

            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _runService.Delete(id);

            return NoContent();
        }

        [HttpGet("summary")]
        public ActionResult<object> GetSummary()
        {
            var summary = _runService.GetSummary();

            return Ok(summary);
        }

    }
}
