import { AlertColor } from "@mui/material";
import { createContext } from "react";

export interface SnackbarContextValue {
    showSnackbar: (
        message: string,
        severity?: AlertColor,
        autoHideDuration?: number
    ) => void;
}

export const SnackbarContext = createContext<SnackbarContextValue | null>(null);
