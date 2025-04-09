import React from "react";
import { AppContext } from "@/components/providers/app/context";
import { requireTrue } from "../utils/panic";

export function useAppContext() {
    const value = React.useContext(AppContext);
    requireTrue(
        value !== null,
        "useAppContext must be used within a AppContext.Provider"
    );
    return React.useContext(AppContext)!;
}
