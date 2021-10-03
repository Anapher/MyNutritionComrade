namespace CommunityCatalog.Core.Options
{
    public class VotingOptions
    {
        public int MinVotesRequired { get; set; } = 10;

        /// <summary>
        ///     If you imagine the current approval rate on a slider:
        ///     Reject [------------------------------] Accept (% approval)
        ///     Set the symmetric threshold required to either accept or reject the contribution.
        ///     For example, if we set the margin to 0.2 and the approval rate is 0.9, it is automatically approved.
        ///     Also, if the approval rate is just 0.15, it is automatically rejected. Everything in between (0.2 to 0.8) will not
        ///     have any effect
        /// </summary>
        public double EffectProportionMargin { get; set; } = 0.2;
    }
}
