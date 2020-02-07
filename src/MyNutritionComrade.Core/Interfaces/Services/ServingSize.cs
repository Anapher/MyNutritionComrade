namespace MyNutritionComrade.Core.Interfaces.Services
{
    public class ServingSize
    {
        public ServingSize(double size, bool isGram)
        {
            Size = size;
            IsGram = isGram;
        }

        /// <summary>
        ///     The size of the serving
        /// </summary>
        public double Size { get; }

        /// <summary>
        ///     Determines whether the serving size is gram or pieces
        /// </summary>
        public bool IsGram { get; }
    }
}