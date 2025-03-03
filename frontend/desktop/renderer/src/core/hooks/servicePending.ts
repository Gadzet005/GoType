import React from "react";
import { Service } from "../types/base/app";

export function useServicePending<TService extends Service>(service: TService) {
    const [pending, setPending] = React.useState(false);

    const runService = React.useCallback(
        async (
            ...args: Parameters<TService>
        ): Promise<Awaited<ReturnType<TService>>> => {
            setPending(true);

            let result: Awaited<ReturnType<TService>>;
            try {
                result = await service(...args);
            } finally {
                setPending(false);
            }

            return result;
        },
        [service]
    );

    const isPending = React.useCallback(() => {
        return pending;
    }, [pending]);

    return {
        isPending,
        call: runService,
    };
}
