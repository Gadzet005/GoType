import { makeObservable, computed, observable, action } from "mobx";

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface UserProfile {
    id: number;
    name: string;
    accessLevel: number;
    banInfo: {
        reason: string;
        expiresAt: number;
    };
}

export class User {
    profile?: UserProfile;
    tokens?: AuthTokens;

    constructor() {
        makeObservable(this, {
            profile: observable,
            tokens: observable,
            isAuth: computed,
            isBanned: computed,
            unauthorize: action,
            setTokens: action,
            setProfile: action,
        });
    }

    setTokens(tokens: AuthTokens) {
        this.tokens = tokens;
    }

    setProfile(profile: UserProfile) {
        this.profile = profile;
    }

    unauthorize() {
        this.profile = undefined;
        this.tokens = undefined;
    }

    get isAuth(): boolean {
        return this.profile !== undefined && this.tokens !== undefined;
    }

    get isBanned(): boolean {
        if (!this.isAuth) {
            return false;
        }
        return this.profile!.banInfo.expiresAt > Date.now();
    }
}
