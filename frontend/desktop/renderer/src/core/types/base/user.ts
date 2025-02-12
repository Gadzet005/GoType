import { AuthTokens } from "@desktop-common/authTokens";

export interface UserProfile {
    id: number;
    name: string;
    accessLevel: number;
    banInfo: {
        reason: string;
        // timestamp
        expiresAt: number;
    };
}

/**
 * Represents a user in the application.
 */
export interface IUser {
    /**
     * The user's profile information.
     * May be null if the user is not authenticated.
     */
    readonly profile: UserProfile | null;

    /**
     * The user's authentication tokens.
     * May be null if the user is not authenticated.
     */
    readonly tokens: AuthTokens | null;

    /**
     * Indicates whether the user is authenticated.
     */
    readonly isAuth: boolean;

    /**
     * Indicates whether the user is currently banned.
     */
    readonly isBanned: boolean;

    /**
     * Sets the user's authentication tokens.
     *
     * @param tokens - The new authentication tokens.
     */
    setTokens(tokens: AuthTokens): void;

    /**
     * Sets the user's profile information.
     *
     * @param profile - The new profile information.
     */
    setProfile(profile: UserProfile): void;

    /**
     * Unauthorizes the user, clearing their authentication tokens and profile information.
     */
    unauthorize(): void;
}
