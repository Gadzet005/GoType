import { makeObservable, computed, observable, action } from "mobx";
import { AuthTokens } from "@desktop-common/authTokens";
import { IUser, UserProfile } from "@/core/types/base/user";

export class User implements IUser {
    private _profile: IUser["profile"] = null;
    private _tokens: IUser["tokens"] = null;

    constructor() {
        makeObservable(this, {
            // @ts-expect-error: private observables
            _profile: observable,
            _tokens: observable,

            profile: computed,
            tokens: computed,
            isAuth: computed,
            isBanned: computed,

            unauthorize: action,
            setTokens: action,
            setProfile: action,
        });
    }

    get profile() {
        return this._profile;
    }

    get tokens() {
        return this._tokens;
    }

    setTokens(tokens: AuthTokens) {
        this._tokens = tokens;
    }

    setProfile(profile: UserProfile) {
        this._profile = profile;
    }

    unauthorize() {
        this._profile = null;
        this._tokens = null;
    }

    get isAuth(): boolean {
        return this._profile !== null && this._tokens !== null;
    }

    get isBanned(): boolean {
        if (!this.isAuth) {
            return false;
        }
        return this._profile!.banInfo.expiresAt > Date.now();
    }
}
