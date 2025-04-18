import { BaseAuthTests } from "./baseAuthTests";
import { signUp } from "@/core/services/api/user/signUp";
import { Dummy } from "./dummy";

describe("Sign up tests", () =>
    BaseAuthTests(signUp, Dummy.signUpArgs, Dummy.signUpResult));
