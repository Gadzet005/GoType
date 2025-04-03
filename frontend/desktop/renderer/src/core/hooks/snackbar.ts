import {
    SnackbarContextValue,
    SnackbarContext,
} from "@/components/providers/snackbar/context";
import React from "react";
import { requireTrue } from "../utils/panic";

export const useSnackbar = (): SnackbarContextValue => {
    const context = React.useContext(SnackbarContext);
    requireTrue(
        context !== undefined,
        "useSnackbar must be used within a SnackbarProvider"
    );
    return context!;
};
