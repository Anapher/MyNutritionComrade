declare module 'Models' {
    export type UserVoteDto = {
        approve: boolean;
        createdOn: string;
    };

    export type ProductContributionStatistics = {
        totalVotes: number;
        approveVotes: number;
    };

    export type ProductContributionStatus = 'pending' | 'applied' | 'rejected';

    export type ProductContributionDto = {
        id: string;
        status: ProductContributionStatus;
        statusDescription?: string;
        productId: string;
        patch: PatchOperation[];
        createdOn: string;

        isContributionFromUser: boolean;

        statistics: ProductContributionStatistics;
        vote?: UserVoteDto;
    };
}
