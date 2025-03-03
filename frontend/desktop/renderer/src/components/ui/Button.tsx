import { useNavigate } from "@/core/hooks";
import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps,
} from "@mui/material";
import React from "react";

export interface ButtonProps extends MUIButtonProps {
  params?: object;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { href, params, onClick, ...other } = props;
  const navigate = useNavigate();

  const handleClick = (event: any) => {
    onClick?.(event);
    if (href) {
      event.preventDefault();
      navigate(href, params ?? {});
    }
  };

  return <MUIButton onClick={handleClick} {...other} />;
};
