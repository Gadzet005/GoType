import { AppCtx } from "@/components/providers/app/AppCtx";
import { GlobalAppContext } from "@/core/store/appContext";
import { IUser } from "@/core/types/base/user";
import { render, renderHook } from "@testing-library/react";
import React from "react";

export function renderWithUser(user: IUser, children: React.ReactNode) {
  const ctx = new GlobalAppContext(user);
  return render(<AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>);
}

export function renderHookWithUser(user: IUser, hook: any) {
  const ctx = new GlobalAppContext(user);
  return renderHook(hook, {
    wrapper: ({ children }: any) => (
      <AppCtx.Provider value={ctx}>{children}</AppCtx.Provider>
    ),
  });
}
