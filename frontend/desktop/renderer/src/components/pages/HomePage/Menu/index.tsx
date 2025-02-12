import { Box } from "@mui/material";
import { MenuItemView } from "./item";
import { AccessType, MenuItem } from "./types";
import React from "react";
import { useAppContext } from "@/core/hooks";

interface MenuProps {
  list: MenuItem[];
  userAuthed?: boolean;
}

export const Menu: React.FC<MenuProps> = React.memo(
  ({ list, userAuthed = false }) => {
    const ctx = useAppContext();

    const items = list
      .filter((item) => {
        return (
          item.accessType == AccessType.forAll ||
          (userAuthed && item.accessType == AccessType.forAuth) ||
          (!userAuthed && item.accessType == AccessType.forAnonymous)
        );
      })
      .map((item) => {
        return (
          <MenuItemView
            key={item.label}
            label={item.label}
            href={item.href}
            color={item.color}
            onClick={(event: any) => {
              if (item.onClick) {
                item.onClick(event, ctx);
              }
            }}
            icon={item.icon}
          />
        );
      });

    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          gap: 1,
        }}
      >
        {items}
      </Box>
    );
  }
);
