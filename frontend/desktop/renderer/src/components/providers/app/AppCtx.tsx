import React from "react";
import { AppContext } from "@/core/types/base/app";
import { GlobalAppContext } from "@/core/store/appContext";

export const AppCtx = React.createContext<AppContext>(new GlobalAppContext());
