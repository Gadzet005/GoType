import { Button } from "@/components/ui/Button";
import { MenuItem } from "./types";
import React from "react";

export type MenuItemViewProps = Omit<MenuItem, "accessType">;

export const MenuItemView: React.FC<MenuItemViewProps> = React.memo(
  ({ label, onClick, href, icon, color = "primary" }) => {
    return (
      <Button
        sx={{
          width: "100%",
          textAlign: "center",
          p: 2,
          fontSize: "1.25rem",
          fontWeight: 700,
        }}
        variant="contained"
        color={color}
        href={href}
        onClick={(event) => onClick?.(event)}
        startIcon={icon}
        size="large"
      >
        {label}
      </Button>
    );
  }
);
