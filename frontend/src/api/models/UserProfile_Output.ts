/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeFiActivity } from './DeFiActivity';
import type { ExperienceLevel } from './ExperienceLevel';
import type { InvestmentGoal } from './InvestmentGoal';
import type { InvestmentHorizon } from './InvestmentHorizon';
import type { RiskTolerance } from './RiskTolerance';
export type UserProfile_Output = {
    risk_tolerance: RiskTolerance;
    investment_amount: number;
    investment_currency?: string;
    investment_horizon: InvestmentHorizon;
    experience_level: ExperienceLevel;
    investment_goals: Array<InvestmentGoal>;
    preferred_activities: Array<DeFiActivity>;
};

