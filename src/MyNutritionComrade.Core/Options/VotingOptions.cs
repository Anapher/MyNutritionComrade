namespace MyNutritionComrade.Core.Options
{
    public class VotingOptions
    {
        public int MinVotesRequired { get; set; } = 10;
        public double ApproveVoteProportionRequired { get; set; } = 0.8;
    }
}
