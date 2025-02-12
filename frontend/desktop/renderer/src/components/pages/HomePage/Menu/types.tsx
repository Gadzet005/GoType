import { AppContext } from "@/core/types/base/app";
import { ButtonProps } from "@mui/material";

export enum AccessType {
  forAnonymous,
  forAuth,
  forAll,
}

export type MenuItem = {
  accessType: AccessType;
  label: string;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
    ctx: AppContext
  ) => void;
  href?: string;
  color?: ButtonProps["color"];
  icon?: React.ReactNode;
};
