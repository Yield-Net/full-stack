/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DashboardResponse } from '../models/DashboardResponse';
import type { ExecuteStrategyRequest } from '../models/ExecuteStrategyRequest';
import type { InvestmentRequest } from '../models/InvestmentRequest';
import type { InvestmentResponse } from '../models/InvestmentResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { LoginResponse } from '../models/LoginResponse';
import type { MarketResponse } from '../models/MarketResponse';
import type { MessageRequest } from '../models/MessageRequest';
import type { StrategyResponse } from '../models/StrategyResponse';
import type { Transaction } from '../models/Transaction';
import type { UserProfile_Input } from '../models/UserProfile_Input';
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
        requestBody: UserProfile_Input,
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
    public static executeStrategyStrategyExecutePost(
        requestBody: ExecuteStrategyRequest,
    ): CancelablePromise<Transaction> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/strategy/execute',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Dashboard
     * @param userId
     * @returns DashboardResponse Successful Response
     * @throws ApiError
     */
    public static getDashboardDashboardGet(
        userId: string,
    ): CancelablePromise<DashboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/dashboard',
            query: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Handle Message
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static handleMessageAiAgentMessagePost(
        requestBody: MessageRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ai-agent/message',
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
