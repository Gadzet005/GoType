export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export async function getAccessToken(): Promise<string | undefined> {
    let accessToken = localStorage.getItem("access_token");
    if (accessToken) {
        return accessToken;
    }

    const tokens = await window.userAPI.getTokens();
    if (!tokens) {
        return undefined;
    }

    accessToken = tokens.accessToken;
    localStorage.setItem("access_token", tokens.accessToken);
    return accessToken;
}

export async function getAuthTokens(): Promise<AuthTokens | undefined> {
    const tokens = await window.userAPI.getTokens();
    return tokens;
}

export async function storeAuthTokens(tokens: AuthTokens): Promise<void> {
    await window.userAPI.storeTokens(tokens.accessToken, tokens.refreshToken);
    localStorage.setItem("access_token", tokens.accessToken);
}

export async function clearAuthTokens(): Promise<void> {
    await window.userAPI.clearTokens();
    localStorage.removeItem("access_token");
}
