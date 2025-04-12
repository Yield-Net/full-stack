/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeFiActivity } from './DeFiActivity';
import type { ExperienceLevel } from './ExperienceLevel';
import type { IncomeFrequency } from './IncomeFrequency';
import type { InvestmentGoal } from './InvestmentGoal';
import type { InvestmentHorizon } from './InvestmentHorizon';
import type { RiskTolerance } from './RiskTolerance';
/**
 * User investment profile model
 */
export type models__users__UserProfile = {
    /**
     * User's risk tolerance level
     */
    risk_tolerance: RiskTolerance;
    /**
     * Amount user wants to invest
     */
    investment_amount: number;
    /**
     * Currency of investment (USD, ETH, BTC, etc.)
     */
    investment_currency?: string;
    /**
     * Investment time horizon
     */
    investment_horizon: InvestmentHorizon;
    /**
     * User's experience with crypto/DeFi
     */
    experience_level: ExperienceLevel;
    /**
     * User's investment goals
     */
    investment_goals: Array<InvestmentGoal>;
    /**
     * User's existing crypto holdings as asset:amount pairs
     */
    existing_portfolio?: (Record<string, number> | null);
    /**
     * Frequency of regular contributions
     */
    income_source?: IncomeFrequency;
    /**
     * Amount of regular contribution
     */
    income_amount?: (number | null);
    /**
     * User's country/jurisdiction
     */
    jurisdiction?: (string | null);
    /**
     * User's preferred DeFi activities
     */
    preferred_activities?: Array<DeFiActivity>;
};

