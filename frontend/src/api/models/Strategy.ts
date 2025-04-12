/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeFiActivity } from './DeFiActivity';
export type Strategy = {
    protocol: string;
    activity: DeFiActivity;
    token: string;
    allocation_percent: number;
    expected_apy: number;
    estimated_return: number;
    risk_level: string;
    why: string;
};

