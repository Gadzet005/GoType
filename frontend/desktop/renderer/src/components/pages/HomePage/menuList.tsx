import { RoutePath } from "@/core/config/routes/path";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonIcon from "@mui/icons-material/Person2";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { MenuItem, AccessType } from "./Menu/types";
import { quitApp } from "@/core/services/electron/app/quitApp";

export const menuList: MenuItem[] = [
  {
    label: "Вход",
    href: RoutePath.signIn,
    accessType: AccessType.forAnonymous,
  },
  {
    label: "Регистрация",
    href: RoutePath.signUp,
    accessType: AccessType.forAnonymous,
  },
  {
    label: "Играть",
    href: RoutePath.levelList,
    accessType: AccessType.forAuth,
    icon: <PlayArrowIcon />,
  },
  {
    label: "Редактор",
    href: RoutePath.editor,
    accessType: AccessType.forAuth,
    icon: <ModeEditOutlineIcon />,
  },
  {
    label: "Профиль",
    href: RoutePath.profile,
    accessType: AccessType.forAuth,
    icon: <PersonIcon />,
  },
  {
    label: "Выход",
    accessType: AccessType.forAll,
    onClick: async (event, ctx) => {
      event.preventDefault();
      await ctx.runService(quitApp);
    },
    icon: <ExitToAppIcon />,
    color: "error",
  },
];
