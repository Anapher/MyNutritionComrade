declare module 'Models' {
    export interface ProductContribution {
        id: string;
        userId: string;
        status: 'pending' | 'applied' | 'rejected';
        appliedVersion?: number;
        createdOn: string;
        patch: PatchOperation[];
    }

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

    export interface OpSetProperty {
        type: 'set';
        path: string;
        value: any;
    }

    export interface OpUnsetProperty {
        type: 'unset';
        path: string;
    }

    export interface OpAddItem {
        type: 'add';
        path: string;
        item: any;
    }

    export interface OpRemoveItem {
        type: 'remove';
        path: string;
        item: any;
    }

    export type PatchOperation = OpSetProperty | OpUnsetProperty | OpAddItem | OpRemoveItem;
}
