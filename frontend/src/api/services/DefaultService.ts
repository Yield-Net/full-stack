/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExecuteStrategyRequest } from '../models/ExecuteStrategyRequest';
import type { InvestmentRequest } from '../models/InvestmentRequest';
import type { InvestmentResponse } from '../models/InvestmentResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { MarketResponse } from '../models/MarketResponse';
import type { StrategyResponse } from '../models/StrategyResponse';
import type { Transaction } from '../models/Transaction';
import type { UserProfile } from '../models/UserProfile';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get Market Context
     * @returns MarketResponse Successful Response
     * @throws ApiError
     */
    public static getMarketContextStrategiesMarketContextGet(): CancelablePromise<MarketResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/strategies/market-context',
        });
    }
    /**
     * Generate
     * @param requestBody
     * @returns StrategyResponse Successful Response
     * @throws ApiError
     */
    public static generateStrategiesGenerateStrategyPost(
        requestBody: UserProfile,
    ): CancelablePromise<StrategyResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/strategies/generate-strategy',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Login User
     * @param requestBody
     * @returns LoginResponse Successful Response
     * @throws ApiError
     */
    public static loginUserAuthLoginPost(
        requestBody: LoginRequest,
    ): CancelablePromise<LoginResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fund User Wallet
     * @param requestBody
     * @returns InvestmentResponse Successful Response
     * @throws ApiError
     */
    public static fundUserWalletInvestFundPost(
        requestBody: InvestmentRequest,
    ): CancelablePromise<InvestmentResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invest/fund',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Execute Strategy
     * @param requestBody
     * @returns Transaction Successful Response
     * @throws ApiError
     */
    public static executeStrategyApiStrategyExecutePost(
        requestBody: ExecuteStrategyRequest,
    ): CancelablePromise<Array<Transaction>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/strategy/execute',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public static readRootGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
        });
    }
    /**
     * Ping
     * @returns any Successful Response
     * @throws ApiError
     */
    public static pingPingGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ping',
        });
    }
}
