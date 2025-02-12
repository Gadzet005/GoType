import React from "react";
import { DEFAULT_PATH, RouteList } from "./common";
import { NavigationContext } from "./context";

interface AppNavigationProps {
  routes: RouteList;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({ routes }) => {
  const [path, setPath] = React.useState<string>(DEFAULT_PATH);
  const [params, setParams] = React.useState<object>({});

  const navigate = (path: string, params?: object) => {
    const pageGetter = routes.get(path);
    if (pageGetter) {
      setPath(path);
      setParams(params || {});
    } else {
      setPath(DEFAULT_PATH);
      setParams([]);
    }
  };

  const PageComponent =
    routes.get(path) || routes.get(DEFAULT_PATH) || (() => null);

  const page = <PageComponent {...params} />;

  return (
    <NavigationContext.Provider value={{ navigate, path, params }}>
      {page}
    </NavigationContext.Provider>
  );
};
