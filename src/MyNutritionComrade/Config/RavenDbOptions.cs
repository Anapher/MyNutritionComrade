namespace MyNutritionComrade.Config
{
    public class RavenDbOptions
    {
        public string[] Urls { get; set; } = new string[0];
        public string DatabaseName { get; set; } = "MyNutritionComrade";
        public string? CertPath { get; set; }
        public string? CertPass { get; set; }
    }
}