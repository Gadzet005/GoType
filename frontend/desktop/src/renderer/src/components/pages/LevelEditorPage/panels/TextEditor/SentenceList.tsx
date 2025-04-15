import React from "react";
import { DraftSentence } from "../../store/draftSentence";
import { Box, Stack } from "@mui/material";
import { ListItem, SentenceListItem } from "./SentenceListItem";

interface SentenceListProps {
  list: DraftSentence[];
  onSelect: (sentence: DraftSentence) => void;
}

export const SentenceList: React.FC<SentenceListProps> = ({
  list,
  onSelect,
}) => {
  return (
    <Box>
      <Stack sx={{ px: 5 }} spacing={1}>
        <ListItem left="Время" right="Текст" />
        {list.map((sentence) => {
          return (
            <SentenceListItem
              key={sentence.idx}
              sentence={sentence}
              onClick={() => onSelect(sentence)}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
