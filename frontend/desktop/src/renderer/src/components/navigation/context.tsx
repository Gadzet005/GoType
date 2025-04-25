import React from "react";
import { DEFAULT_PATH } from "./common";

interface NavigationContextData {
  navigate: (path: string, params?: Record<string, unknown>) => void;
  path: string;
  params: Record<string, unknown>;
}

export const NavigationContext = React.createContext<NavigationContextData>({
  navigate: () => {},
  path: DEFAULT_PATH,
  params: {},
});
