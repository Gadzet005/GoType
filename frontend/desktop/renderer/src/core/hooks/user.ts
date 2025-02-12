import { AppCtx } from "@/components/providers/app/AppCtx";
import React from "react";
import { IUser } from "../types/base/user";

export const useUser = (): IUser => React.useContext(AppCtx).user;
