import { AppCtx } from "@/components/providers/app/AppCtx";
import { GlobalAppContext } from "@/core/store/appContext";
import { IUser } from "@/core/types/base/user";
import React from "react";

export function renderWithUser(user: IUser, children: React.ReactNode) {
  const ctx = new GlobalAppContext(user);
  return <AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>;
}
