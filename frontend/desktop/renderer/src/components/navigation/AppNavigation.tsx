import React from "react";
import { DEFAULT_PATH, RouteList } from "./common";
import { NavigationContext } from "./context";

interface AppNavigationProps {
  routes: RouteList;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({ routes }) => {
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

  const PageComponent = React.useMemo(() => {
    const component = routes.get(path) ?? routes.get(DEFAULT_PATH);
    return (
      component ??
      (() => {
        console.error("No route component found");
        return null;
      })
    );
  }, [path, routes]);

  const page = React.useMemo(
    () => <PageComponent {...params} />,
    [PageComponent, params]
  );

  const navContext = React.useMemo(
    () => ({ navigate, path, params }),
    [navigate, path, params]
  );

  return (
    <NavigationContext.Provider value={navContext}>
      {page}
    </NavigationContext.Provider>
  );
};
