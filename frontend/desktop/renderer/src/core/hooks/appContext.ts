import React from "react";
import { AppContext } from "../types/base/app";
import { AppCtx } from "@/components/providers/app/AppCtx";

export const useAppContext = (): AppContext => React.useContext(AppCtx);
