import { loadUserProfile } from "@/core/services/api/user/loadUserProfile";
import { logout } from "@/core/services/api/user/logout";
import { getAuthTokens } from "@/core/services/electron/tokens/getAuthTokens";
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
      const getTokensResult = await context.runService(getAuthTokens);
      if (!getTokensResult.ok) {
        return;
      }

      context.user.setTokens(getTokensResult.payload!);
      const loadResult = await context.runService(loadUserProfile);
      if (!loadResult.ok) {
        await context.runService(logout);
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
