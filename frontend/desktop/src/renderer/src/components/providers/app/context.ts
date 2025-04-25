import React from "react";
import { AppContext as AppContextValue } from "@/core/types/base/app";

export const AppContext = React.createContext<AppContextValue | null>(null);
