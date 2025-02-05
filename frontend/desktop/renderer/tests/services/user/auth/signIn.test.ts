import { BaseAuthTests } from "./base";
import { SignInService } from "@/core/services/user/signIn";
import { Dummy } from "../dummy";

describe("Sign in tests", () =>
    BaseAuthTests(SignInService, Dummy.signInArgs, Dummy.signInResult));
