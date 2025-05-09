export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface UserProfile {
    id: number;
    name: string;
    accessLevel: number;
    banInfo: {
        reason: string;
        /** timestamp */
        expiresAt: number;
    };
    avatarURL: string | null;
}

export interface UserInfo {
    profile: UserProfile;
    tokens: AuthTokens;
}
