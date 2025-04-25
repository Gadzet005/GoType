import { GamePage } from "@/components/pages/GamePage";
import { GameStatisticsPage } from "@/components/pages/GameStatisticsPage";
import { HomePage } from "@/components/pages/HomePage";
import { LevelEditorPage } from "@/components/pages/LevelEditorPage";
import { LevelListPage } from "@/components/pages/LevelListPage";
import { ProfilePage } from "@/components/pages/ProfilePage";
import { SignInPage } from "@/components/pages/SignInPage";
import { SignUpPage } from "@/components/pages/SignUpPage";
import { RoutePath } from "./path";
import { LevelDraftListPage } from "@/components/pages/LevelDraftListPage";
import { RouteNode } from "@/components/navigation/common";

export const routes = new Map<string, RouteNode>([
    [RoutePath.default, { page: HomePage, forAuth: false }],
    [RoutePath.home, { page: HomePage, forAuth: false }],
    [RoutePath.signIn, { page: SignInPage, forAuth: false }],
    [RoutePath.signUp, { page: SignUpPage, forAuth: false }],
    [RoutePath.profile, { page: ProfilePage }],
    [RoutePath.levelList, { page: LevelListPage }],
    [RoutePath.game, { page: GamePage }],
    [RoutePath.gameStatistics, { page: GameStatisticsPage }],
    [RoutePath.levelEditor, { page: LevelEditorPage }],
    [RoutePath.levelDraftList, { page: LevelDraftListPage }],
]);
