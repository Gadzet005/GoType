import { Tab, TabProps } from "@mui/material";
import React from "react";

export const EditorTab: React.FC<TabProps> = (props) => {
  return <Tab sx={{ fontSize: 25, textTransform: "none" }} {...props} />;
};
