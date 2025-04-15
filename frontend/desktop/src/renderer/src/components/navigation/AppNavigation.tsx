import React from "react";
import { DEFAULT_PATH, RouteList } from "./common";
import { NavigationContext } from "./context";
import { useAppContext, useSnackbar } from "@/core/hooks";
import { observer } from "mobx-react";

interface AppNavigationProps {
  routes: RouteList;
}

export const AppNavigation: React.FC<AppNavigationProps> = observer(
  ({ routes }) => {
    const ctx = useAppContext();
    const snackbar = useSnackbar();
    const [path, setPath] = React.useState<string>(DEFAULT_PATH);
    const [params, setParams] = React.useState<Record<string, unknown>>({});

    const navigate = React.useCallback(
      (newPath: string, newParams?: Record<string, unknown>) => {
        if (!routes.has(newPath)) {
          console.warn(`Route ${newPath} not found, redirecting to default`);
          setPath(DEFAULT_PATH);
          setParams({});
          return;
        }
        setPath(newPath);
        setParams(newParams ?? {});
      },
      [routes]
    );

    const currentRoute = React.useMemo(() => {
      return routes.get(path);
    }, [path, routes]);

    React.useEffect(() => {
      if (currentRoute && (currentRoute.forAuth ?? true) && !ctx.user.isAuth) {
        snackbar.show(
          "Ошибка авторизации. Пожалуйста, войдите снова.",
          "error"
        );
        setPath(DEFAULT_PATH);
        setParams({});
      }
    }, [ctx.user.isAuth, currentRoute, routes]);

    const node = React.useMemo(() => {
      const node = routes.get(path);
      if (!node) {
        console.error(`No route found for path: ${path}`);
        return routes.get(DEFAULT_PATH)!;
      }

      const forAuth = node.forAuth ?? true;
      if (forAuth && !ctx.user.isAuth) {
        return routes.get(DEFAULT_PATH)!;
      }

      return node;
    }, [path, routes, ctx.user]);

    const page = React.useMemo(() => <node.page {...params} />, [node, params]);

    const navContext = React.useMemo(
      () => ({ navigate, path, params }),
      [navigate, path, params]
    );

    return (
      <NavigationContext.Provider value={navContext}>
        {page}
      </NavigationContext.Provider>
    );
  }
);
