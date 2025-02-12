import { User } from "@/core/store/user";
import { UserProfile, IUser } from "@/core/types/base/user";
import { AuthTokens } from "@desktop-common/authTokens";

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

    export function create(isAuth: boolean = false): IUser {
        const user = new User();
        if (isAuth) {
            user.setProfile(profile);
            user.setTokens(authTokens);
        }
        return user;
    }
}
