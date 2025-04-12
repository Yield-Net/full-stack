/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { models__strategy__UserProfile } from '../models/models__strategy__UserProfile';
import type { models__users__UserProfile } from '../models/models__users__UserProfile';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Create User Profile
     * Create a user investment profile.
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createUserProfileUsersProfilePost(
        requestBody: models__users__UserProfile,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Protocols
     * @returns any Successful Response
     * @throws ApiError
     */
    public static listProtocolsProtocolsGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protocols/',
        });
    }
    /**
     * Get Protocol
     * @param protocolId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getProtocolProtocolsProtocolIdGet(
        protocolId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/protocols/{protocol_id}',
            path: {
                'protocol_id': protocolId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Receive User Profile
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static receiveUserProfileStrategiesUserProfilePost(
        requestBody: models__strategy__UserProfile,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/strategies/user-profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Market Context
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getMarketContextStrategiesMarketContextGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/strategies/market-context',
        });
    }
    /**
     * Generate
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateStrategiesGenerateStrategyPost(
        requestBody: models__strategy__UserProfile,
    ): CancelablePromise<any> {
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
