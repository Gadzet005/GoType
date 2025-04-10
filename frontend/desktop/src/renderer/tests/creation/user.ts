import { User } from "@/core/store/user";
import { IUser } from "@/core/types/base/user";
import { UserProfile, AuthTokens, UserInfo } from "@common/user";

export namespace UserDummy {
    export const profile: UserProfile = {
        id: 1,
        name: "testUser",
        accessLevel: 1,
        banInfo: {
            reason: "",
            expiresAt: 0,
        },
    };

    export const authTokens: AuthTokens = {
        accessToken: "access_token",
        refreshToken: "refresh_token",
    };

    export const userInfo: UserInfo = {
        profile: profile,
        tokens: authTokens,
    };

    export function create(isAuth: boolean = false): IUser {
        const user = new User();
        if (isAuth) {
            user.authorize(userInfo);
        }
        return user;
    }
}
