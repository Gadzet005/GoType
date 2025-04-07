import React from "react";
import { NavigationContext } from "@/components/navigation/context";

export function useNavigate() {
    return React.useContext(NavigationContext).navigate;
}

export function useLocation() {
    const context = React.useContext(NavigationContext);
    return {
        path: context.path,
        params: context.params,
    };
}
