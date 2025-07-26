using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunApp.DTO.Run;
using RunApp.Models;
using RunApp.Services;

namespace RunApp.Controllers
{
    [ApiController]
    [Route("api/training-plan/{trainingPlanId}/run")]
    public class RunController : ControllerBase
    {
        private readonly IRunService _runService;

        public RunController(IRunService runService)
        {
            _runService = runService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<RunDto>> GetAll([FromRoute] int trainingPlanId)
        {
            var runs = _runService.GetAll(trainingPlanId);

            return Ok(runs);
        }

        [HttpGet("{id}")]
        public ActionResult<RunDto> GetById([FromRoute] int trainingPlanId, [FromRoute] int id)
        {
            var run = _runService.GetById(trainingPlanId, id);

            return Ok(run);
        }

        [HttpPost]
        public ActionResult Add([FromRoute] int trainingPlanId, [FromBody] RunCreateDto dto)
        {
            var id = _runService.Add(trainingPlanId, dto);

            return Created($"/api/training-plan/{trainingPlanId}/run/{id}", null);
        }

        [HttpPut]
        public ActionResult Update([FromRoute] int trainingPlanId, [FromBody] RunUpdateDto dto)
        {
            _runService.Update(trainingPlanId, dto);

            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int trainingPlanId, [FromRoute] int id)
        {
            _runService.Delete(trainingPlanId, id);

            return NoContent();
        }

        [HttpGet("summary")]
        public ActionResult<object> GetSummary([FromRoute] int trainingPlanId)
        {
            var summary = _runService.GetSummary(trainingPlanId);

            return Ok(summary);
        }

    }
}
