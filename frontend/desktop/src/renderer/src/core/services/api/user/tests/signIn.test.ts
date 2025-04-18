import { BaseAuthTests } from "./baseAuthTests";
import { signIn } from "@/core/services/api/user/signIn";
import { Dummy } from "./dummy";

describe("Sign in tests", () =>
    BaseAuthTests(signIn, Dummy.signInArgs, Dummy.signInResult));
