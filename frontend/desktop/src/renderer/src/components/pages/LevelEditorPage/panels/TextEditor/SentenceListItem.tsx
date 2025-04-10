import React from "react";
import { DraftSentence } from "../../store/draftSentence";
import { Box, Divider, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { timeRangeView } from "./utils";

interface ListItemProps {
  left: string;
  right: string;
  onClick?: () => void;
}

export const ListItem: React.FC<ListItemProps> = ({
  left,
  right,
  onClick = () => {},
}) => {
  return (
    <Box
      className="pointer"
      sx={{
        borderRadius: 3,
        bgcolor: "background.paper",
        "&:hover": {
          bgcolor: "action.hover",
        },
        px: 3,
        py: 2,
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography
          sx={{ width: "20%", textAlign: "center" }}
          variant="h4"
          color="secondary"
        >
          {left}
        </Typography>
        <Divider orientation="vertical" flexItem />
        <Typography sx={{ width: "80%" }} variant="h4">
          {right}
        </Typography>
      </Box>
    </Box>
  );
};

interface SentenceListItemProps {
  sentence: DraftSentence;
  onClick?: () => void;
}

export const SentenceListItem: React.FC<SentenceListItemProps> = observer(
  ({ sentence, onClick }) => {
    return (
      <ListItem
        left={timeRangeView(sentence.showTime, sentence.duration)}
        right={sentence.content}
        onClick={onClick}
      />
    );
  }
);
