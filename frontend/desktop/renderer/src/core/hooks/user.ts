import { IUser } from "../types/base/user";
import { useAppContext } from "./appContext";

export function useUser(): IUser {
    const context = useAppContext();
    return context!.user;
}
