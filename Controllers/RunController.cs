using Microsoft.AspNetCore.Mvc;
using RunApp.DTO;
using RunApp.Models;
using System.Globalization;

namespace RunApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RunController: ControllerBase
    {
        private readonly string _filePath = "run_entries.txt";

        [HttpPost]
        public IActionResult Add([FromBody] Run entry)
        {
            var lines = System.IO.File.Exists(_filePath)
                ? System.IO.File.ReadAllLines(_filePath).ToList()
                : new List<string>();

            int maxId = 0;

            foreach (var line in lines)
            {
                var parts = line.Split(';');
                if (int.TryParse(parts[0], out int id))
                {
                    maxId = Math.Max(maxId, id);
                }
            }

            entry.Id = maxId + 1;

            var newLine = $"{entry.Id};{entry.Date:yyyy-MM-dd};{entry.Place};{entry.WeekNumber};{entry.TrainingNumberInWeek};{entry.DistanceKm};{entry.Duration};{entry.Description}";

            System.IO.File.AppendAllText(_filePath, newLine + Environment.NewLine);

            return Ok(new { message = "Saved", entry.Id });
        }

        [HttpGet]
        public IActionResult Get()
        {
            var entries = getEntries();

            return Ok(entries);
        }

        [HttpGet("latest")]
        public IActionResult GetLatestRun()
        {
            var entries = getEntries();

            var latestRun = entries
                .OrderByDescending(e => e.Date)
                .FirstOrDefault();

            return Ok(latestRun);
        }

        [HttpDelete("{index}")]
        public IActionResult Delete(int index)
        {
            try
            {
                var lines = System.IO.File.ReadAllLines(_filePath).ToList();

                if (index < 0 || index >= lines.Count)
                    return NotFound("Run entry not found.");

                lines.RemoveAt(index);
                System.IO.File.WriteAllLines(_filePath, lines);

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var entries = getEntries();
            var totalDistance = entries.Sum(e => e.DistanceKm);
            var totalDuration = TimeSpan.Zero;

            foreach (var entry in entries)
            {
                totalDuration += entry.Duration;
            }

            TimeSpan avgPace = TimeSpan.Zero;
            if (totalDistance > 0)
            {
                avgPace = TimeSpan.FromSeconds(totalDuration.TotalSeconds / totalDistance);
            }

            return Ok(new
            {
                totalDistance,
                totalDuration = totalDuration.ToString(@"hh\:mm\:ss"),
                avgPace = avgPace.ToString(@"mm\:ss")
            });
        }

        private List<RunDto> getEntries()
        {
            var lines = System.IO.File.ReadAllLines(_filePath);
            var entries = new List<RunDto>();

            foreach (var line in lines)
            {
                var parts = line.Split(';');
                var entry = new RunDto
                {
                    Date = System.DateOnly.Parse(parts[1]),
                    Place = parts[2] == "Outdoor" ? RunPlace.Outdoor : RunPlace.Treadmill,
                    WeekNumber = int.Parse(parts[3]),
                    TrainingNumberInWeek = int.Parse(parts[4]),
                    DistanceKm = double.Parse(parts[5].Replace(',', '.'), CultureInfo.InvariantCulture),
                    Duration = System.TimeSpan.Parse(parts[6]),
                    Description = parts[7]
                };
                entries.Add(entry);
            }

            return entries;
        }
    }
}
