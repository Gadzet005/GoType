import { getUserInfo } from "@/core/services/electron/user/getUserInfo";
import { GlobalAppContext } from "@/core/store/appContext";
import { User } from "@/core/store/user";
import { AppContext as AppCtx } from "@/core/types/base/app";
import { observer } from "mobx-react";
import React from "react";
import { AppContext } from "./context";
import { appConfig } from "@/core/config/app.config";

interface AppContextProviderProps {
  initialUser?: User;
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = observer(
  ({ initialUser, children }) => {
    if (!initialUser) {
      initialUser = new User();
    }

    const [context] = React.useState<AppCtx>(
      new GlobalAppContext(appConfig, initialUser)
    );

    const loadUser = React.useCallback(async () => {
      const result = await getUserInfo();
      if (result.ok) {
        context.user.authorize(result.payload);
      } else {
        console.error("Failed to load user info");
      }
    }, [context]);

    React.useEffect(() => {
      if (!context.user.isAuth) {
        loadUser();
      }
    }, [context.user.isAuth, loadUser]);

    return (
      <AppContext.Provider value={context}>{children}</AppContext.Provider>
    );
  }
);
