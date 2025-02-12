import React from "react";
import { Service } from "../types/base/app";
import { RemoveFirst } from "../types/utils";
import { useAppContext } from "./appContext";

export function useServicePending<TService extends Service>(service: TService) {
    const ctx = useAppContext();
    const [pending, setPending] = React.useState(false);

    const runService = React.useCallback(
        async (
            ...args: RemoveFirst<Parameters<TService>>
        ): Promise<Awaited<ReturnType<TService>>> => {
            setPending(true);

            let result: Awaited<ReturnType<TService>>;
            try {
                result = await ctx.runService(service, ...args);
            } finally {
                setPending(false);
            }

            return result;
        },
        [ctx, service]
    );

    const isPending = React.useCallback(() => {
        return pending;
    }, [pending]);

    return {
        isPending,
        call: runService,
    };
}
