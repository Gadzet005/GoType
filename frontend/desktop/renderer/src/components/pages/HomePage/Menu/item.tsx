import { Button } from "@/components/ui/Button";
import { MenuItem } from "./types";
import React from "react";

export type MenuItemViewProps = Omit<MenuItem, "accessType">;

export const MenuItemView: React.FC<MenuItemViewProps> = React.memo(
  ({ label, onClick, href, icon, color }) => {
    return (
      <Button
        sx={{
          width: "100%",
          textAlign: "center",
          p: 2,
          fontSize: "1.25rem",
          fontWeight: 700,
          "&:hover": {
            bgcolor: `${color}.dark`,
          },
        }}
        variant="contained"
        color={color}
        href={href}
        onClick={onClick}
        startIcon={icon}
        size="large"
      >
        {label}
      </Button>
    );
  }
);
