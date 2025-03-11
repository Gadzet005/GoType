import { getUserInfo, logout } from "@/api/user";
import { AuthTokens, clearAuthTokens, storeAuthTokens } from "@/public/auth";
import { User } from "@/public/user";

export async function auth(
    user: User,
    tokens: AuthTokens,
    shouldStore: boolean = true
) {
    if (shouldStore) {
        await storeAuthTokens(tokens);
    }
    const result = await getUserInfo();
    if (result.ok) {
        user.authorize(result.payload!);
    }
}

export async function unauth(user: User): Promise<void> {
    await logout();
    await clearAuthTokens();
    user.unauthorize();
}
