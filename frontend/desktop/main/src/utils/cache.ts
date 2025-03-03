import { LRUCache } from "lru-cache/dist/commonjs";

type ArgsConverter = (obj: any, args: any[]) => any;

interface CacheOptions {
    max: number;
    argsConverter: ArgsConverter;
    maxSize?: number;
    ttl?: number;
}

namespace CacheDefault {
    export const max = 1000;
    export const argsConverter: ArgsConverter = (_, args) => args;

    export function useDefaultOptions(
        options?: Partial<CacheOptions>
    ): CacheOptions {
        const result = options ?? {};
        result.max = result.max ?? CacheDefault.max;
        result.argsConverter =
            result.argsConverter ?? CacheDefault.argsConverter;
        return result as CacheOptions;
    }
}

export interface Cached {
    (...arg: any[]): any;
    clearCache(key?: any): void;
}

/**
 * A decorator function that caches the return values of methods based on their arguments.
 *
 * @param _options - Optional cache options. If not provided, default options will be used.
 * @returns A decorator function that can be applied to class methods.
 */
export function cache(_options?: Partial<CacheOptions>) {
    const options = CacheDefault.useDefaultOptions(_options);
    const cache = new LRUCache<any, any>({
        max: options.max,
        maxSize: options?.maxSize,
        ttl: options?.ttl,
        updateAgeOnGet: true,
    });

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const key = options.argsConverter(this, args);

            if (cache.has(key)) {
                return cache.get(key);
            }

            const result = original.apply(this, args);
            cache.set(key, result);

            return result;
        };

        descriptor.value.clearCache = (key?: any) => {
            if (key) {
                cache.delete(key);
            } else {
                cache.clear();
            }
        };

        return descriptor;
    };
}
