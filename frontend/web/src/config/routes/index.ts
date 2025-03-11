import { Register } from "@/components/pages/auth/register";
import { Login } from "@/components/pages/auth/login";
import { Main } from "@/components/pages/main/main";
import { Download } from "@/components/pages/download/download";
import { Rating } from "@/components/pages/rating/rating";
import { Levels } from "@/components/pages/levels/levels";
import { Level } from "@/components/pages/levels/current_level";
import { Profile } from "@/components/pages/profile/profile";
import { Admin } from "@/components/pages/admin/admin";
import { CommunityRules } from "@/components/pages/support/rules";
import { Complaint } from "@/components/pages/support/complaint";
import { FAQ } from "@/components/pages/support/faq";
import { Agreement } from "@/components/pages/support/agreement";

export { RoutePath } from "./path";

import { RoutePath } from "./path";
import React from "react";



export const routes = new Map<string, React.ElementType>([
//-
    [RoutePath.register, Register],
    [RoutePath.login, Login],
    [RoutePath.default, Main],
    [RoutePath.download, Download],
    [RoutePath.rating, Rating],
    [RoutePath.levelList, Levels],
    [RoutePath.level, Level],
    [RoutePath.profile, Profile],
    [RoutePath.admin, Admin],
    [RoutePath.rules, CommunityRules],
    [RoutePath.complaint, Complaint],
    [RoutePath.faq, FAQ],
    [RoutePath.agreement, Agreement],
]);