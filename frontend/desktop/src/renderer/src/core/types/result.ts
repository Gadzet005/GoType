import { ApiError } from "@/core/config/api.config";

interface PositiveResult<T> {
    ok: true;
    payload: T;
}

interface NegativeResult<T> {
    ok: false;
    error: T;
}

export type Result<T, E> = PositiveResult<T> | NegativeResult<E>;
export type PromiseResult<T, E> = Promise<Result<T, E>>;

export function success(): Result<void, never>;
export function success<T>(payload: T): Result<T, never>;
export function success<T>(payload?: T): Result<T | void, never> {
    if (arguments.length === 0) {
        return { ok: true } as Result<void, never>;
    }
    return { ok: true, payload } as Result<never, never>;
}

export function failure(): Result<never, any>;
export function failure<T>(error: T): Result<never, T>;
export function failure<T>(error?: T): Result<never, T> {
    if (arguments.length === 0) {
        return { ok: false } as Result<never, never>;
    }
    return { ok: false, error } as Result<never, T>;
}

export function commonApiErrorResult(error: any): Result<never, string> {
    if (error.response?.data.message) {
        return {
            ok: false,
            error: error.response?.data.message,
        };
    } else {
        return {
            ok: false,
            error: ApiError.unexpected,
        };
    }
}
