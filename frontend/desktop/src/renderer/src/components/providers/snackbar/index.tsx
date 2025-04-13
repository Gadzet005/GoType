import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import { SnackbarContext } from "./context";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
  autoHideDuration: number;
}

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
    autoHideDuration: 5000,
  });

  const show = React.useCallback(
    (
      message: string,
      severity: AlertColor = "info",
      autoHideDuration: number = 5000
    ) => {
      setSnackbar({ open: true, message, severity, autoHideDuration });
    },
    []
  );

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const contextValue = React.useMemo(() => ({ show }), [show]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
