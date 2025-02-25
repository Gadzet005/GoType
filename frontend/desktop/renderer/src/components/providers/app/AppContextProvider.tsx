import { getUserInfo } from "@/core/services/electron/user/getUserInfo";
import { GlobalAppContext } from "@/core/store/appContext";
import { User } from "@/core/store/user";
import { AppContext } from "@/core/types/base/app";
import { observer } from "mobx-react";
import React from "react";
import { AppCtx } from "./AppCtx";

interface AppContextProviderProps {
  initialUser?: User;
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = observer(
  ({ initialUser, children }) => {
    if (!initialUser) {
      initialUser = new User();
    }

    const [context] = React.useState<AppContext>(
      new GlobalAppContext(initialUser)
    );

    const loadUser = React.useCallback(async () => {
      const result = await context.runService(getUserInfo);
      if (result.ok) {
        context.user.authorize(result.payload);
      } else {
        console.error("Failed to load user info:", result.error);
      }
    }, [context]);

    React.useEffect(() => {
      if (!context.user.isAuth) {
        loadUser();
      }
    }, [context.user.isAuth, loadUser]);

    return <AppCtx.Provider value={context}>{children}</AppCtx.Provider>;
  }
);
