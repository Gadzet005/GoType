import { AppContext } from "@/components/providers/app/context";
import { GlobalAppContext } from "@/core/store/appContext";
import { IUser } from "@/core/types/base/user";
import { render, renderHook } from "@testing-library/react";
import React from "react";

export function renderWithUser(user: IUser, children: React.ReactNode) {
  const ctx = new GlobalAppContext(user);
  return render(
    <AppContext.Provider value={ctx}>{children}</AppContext.Provider>
  );
}

export function renderHookWithUser(user: IUser, hook: any) {
  const ctx = new GlobalAppContext(user);
  return renderHook(hook, {
    wrapper: ({ children }: any) => (
      <AppContext.Provider value={ctx}>{children}</AppContext.Provider>
    ),
  });
}
