import React from "react";
import { Service } from "../types/base/app";
import { RemoveFirst } from "../types/utils";
import { useAppContext } from "./appContext";

export function useServicePending<TService extends Service>(service: TService) {
    const ctx = useAppContext();
    const [pending, setPending] = React.useState(false);

    const runService = React.useCallback(
        (
            ...args: RemoveFirst<Parameters<TService>>
        ): Promise<Awaited<ReturnType<TService>>> => {
            setPending(true);
            return ctx
                .runService(service, ...args)
                .finally(() => setPending(false));
        },
        [ctx, setPending, service]
    );

    const isPending = React.useCallback(() => {
        return pending;
    }, [pending]);

    return {
        isPending,
        call: runService,
    };
}
