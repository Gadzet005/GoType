import React from "react";
import { DEFAULT_PATH } from "./common";

interface NavigationContextData {
  navigate: (path: string, params?: object) => void;
  path: string;
  params: object;
}

export const NavigationContext = React.createContext<NavigationContextData>({
  navigate: () => {},
  path: DEFAULT_PATH,
  params: {},
});
