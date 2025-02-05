import { BaseAuthTests } from "./base";
import { SignUpService } from "@/core/services/user/signUp";
import { Dummy } from "../dummy";

describe("Sign up tests", () =>
    BaseAuthTests(SignUpService, Dummy.signUpArgs, Dummy.signUpResult));
