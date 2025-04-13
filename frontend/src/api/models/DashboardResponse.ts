/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StrategyWrapper } from './StrategyWrapper';
import type { UserPortfolio } from './UserPortfolio';
import type { UserProfile_Output } from './UserProfile_Output';
export type DashboardResponse = {
    profile: UserProfile_Output;
    portfolio?: (Array<UserPortfolio> | null);
    strategies?: (Array<StrategyWrapper> | null);
};

