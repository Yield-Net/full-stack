/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Strategy } from './Strategy';
import type { UserProfile_Input } from './UserProfile_Input';
export type UpdateProfileRequest = {
    updated_profile: UserProfile_Input;
    new_strategy: Array<Strategy>;
    user_confirmed: boolean;
};

