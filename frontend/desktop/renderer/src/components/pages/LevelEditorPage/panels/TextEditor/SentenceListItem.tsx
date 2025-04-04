import React from "react";
import { DraftSentence } from "../../store/draftSentence";
import { Box, Divider, Typography } from "@mui/material";
import { observer } from "mobx-react";

function timeView(time: number | null) {
  if (!time) {
    return "?";
  }
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

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
    const hideTime =
      sentence.showTime && sentence.duration
        ? sentence.showTime + sentence.duration
        : null;
    return (
      <ListItem
        left={`${timeView(sentence.showTime)} - ${timeView(hideTime)}`}
        right={sentence.content}
        onClick={onClick}
      />
    );
  }
);
