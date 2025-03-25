import React from "react";

export const PauseContext = React.createContext<boolean>(false);
export const useIsPaused = () => React.useContext(PauseContext);
