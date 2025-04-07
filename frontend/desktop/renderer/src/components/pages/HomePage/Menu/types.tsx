import { ButtonProps } from "@mui/material";

export enum AccessType {
  forAnonymous,
  forAuth,
  forAll,
}

export type MenuItem = {
  accessType: AccessType;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  href?: string;
  color?: ButtonProps["color"];
  icon?: React.ReactNode;
};
