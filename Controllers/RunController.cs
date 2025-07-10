using Microsoft.AspNetCore.Mvc;
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
        public IActionResult AddRunEntry([FromBody] RunEntry entry)
        {
            var line = $"{entry.Date:yyyy-MM-dd};{entry.WeekNumber};{entry.TrainingNumberInWeek};{entry.DistanceKm};{entry.Duration};{entry.Description}";
            System.IO.File.AppendAllText(_filePath, line + Environment.NewLine);
            return Ok(new { message = "Saved" });
        }

        [HttpGet("all")]
        public IActionResult GetAll()
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

            return Ok(new
            {
                totalDistance,
                totalDuration = totalDuration.ToString(@"hh\:mm\:ss")
            });
        }

        private List<RunEntry> getEntries()
        {
            var lines = System.IO.File.ReadAllLines(_filePath);
            var entries = new List<RunEntry>();

            foreach (var line in lines)
            {
                var parts = line.Split(';');
                var entry = new RunEntry
                {
                    Date = System.DateOnly.Parse(parts[0]),
                    WeekNumber = int.Parse(parts[1]),
                    TrainingNumberInWeek = int.Parse(parts[2]),
                    DistanceKm = double.Parse(parts[3].Replace(',', '.'), CultureInfo.InvariantCulture),
                    Duration = System.TimeSpan.Parse(parts[4]),
                    Description = parts[5]

                };
                entries.Add(entry);
            }

            return entries;
        }
    }
}
