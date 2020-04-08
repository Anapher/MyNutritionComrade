declare module 'Models' {
    type UserVoteDto = {
        approve: boolean;
        createdOn: string;
    };

    type ProductContributionStatistics = {
        totalVotes: number;
        approveVotes: number;
    };

    type ProductContributionDto = {
        id: string;
        status: 'pending' | 'applied' | 'rejected';
        statusDescription?: string;
        productId: string;
        patch: PatchOperation[];
        createdOn: string;

        isContributionFromUser: boolean;

        statistics: ProductContributionStatistics;
        vote?: UserVoteDto;
    };
}
