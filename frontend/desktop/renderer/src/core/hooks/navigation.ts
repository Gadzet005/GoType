import React from "react";
import { NavigationContext } from "@/components/navigation/context";

export const useNavigate = () => {
    return React.useContext(NavigationContext).navigate;
};

export const useLocation = () => {
    const context = React.useContext(NavigationContext);
    return {
        path: context.path,
        params: context.params,
    };
};
