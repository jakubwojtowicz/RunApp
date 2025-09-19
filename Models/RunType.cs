namespace RunApp.Models
{
    public class RunType
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public virtual List<Run> Runs { get; set; }
    }
}
