using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunApp.DTO.Run;
using RunApp.DTO.TrainingPlan;
using RunApp.Models;
using System;
using System.Numerics;
using System.Text;
using RunApp.Services;

namespace RunApp.Controllers
{
    [ApiController]
    [Route("api/training-plan")]
    public class TrainingPlanController : ControllerBase
    {
        private readonly ITrainingPlanService _trainingPlanService;

        public TrainingPlanController(ITrainingPlanService trainingPlanService)
        {
            _trainingPlanService = trainingPlanService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TrainingPlanDto>> GetAll()
        {
            var plans = _trainingPlanService.GetAll();

            return Ok(plans);
        }

        [HttpGet("current")]
        public ActionResult<TrainingPlanDto> GetCurrent()
        {
            var plan = _trainingPlanService.GetCurrent();

            return Ok(plan);
        }

        [HttpGet("{id}")]
        public ActionResult<TrainingPlanDto> GetById(int id)
        {
            var plan = _trainingPlanService.GetById(id);

            return Ok(plan);
        }

        [HttpPost]
        public ActionResult Add([FromBody] TrainingPlanCreateDto planDto)
        {
            var id = _trainingPlanService.Add(planDto);

            return Created($"/api/training-plan/{id}", null);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _trainingPlanService.Delete(id);    

            return Ok();
        }
    }
}
