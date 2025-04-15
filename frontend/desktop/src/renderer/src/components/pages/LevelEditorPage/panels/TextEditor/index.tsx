import { CenterBox } from "@/components/common/CenterBox";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Button, Container, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { useEditorContext } from "../../context";
import { LoadTextDialog } from "./LoadTextDialog";
import { SentenceList } from "./SentenceList";
import { DraftSentence } from "../../store/draftSentence";
import { EditTimingDialog } from "./EditTimingDialog";

export const TextEditor = observer(() => {
  const { draft, audioPlayer } = useEditorContext();

  const [loadTextDialogOpen, setLoadTextDialogOpen] = React.useState(false);
  const [selectedSentence, setSelectedSentence] =
    React.useState<DraftSentence | null>(null);

  const getSentenceShowTime = () => {
    if (!selectedSentence) {
      return null;
    }
    if (selectedSentence.showTime) {
      return selectedSentence.showTime;
    }
    if (selectedSentence.idx > 0) {
      return draft.sentences[selectedSentence.idx - 1].showTime;
    }
    return null;
  };

  if (!draft.audio) {
    return (
      <CenterBox>
        <Typography variant="h5">
          Загрузите аудио файл, чтобы страница стала доступна
        </Typography>
      </CenterBox>
    );
  }

  return (
    <Stack sx={{ height: "85%", alignItems: "center" }} spacing={2}>
      <LoadTextDialog
        open={loadTextDialogOpen}
        onClose={() => setLoadTextDialogOpen(false)}
      />
      {selectedSentence !== null && audioPlayer.isReady && (
        <EditTimingDialog
          open
          onClose={() => setSelectedSentence(null)}
          player={audioPlayer}
          content={selectedSentence.content}
          showTime={getSentenceShowTime()}
          duration={selectedSentence.duration}
          onSave={(showTime: number | null, duration: number | null) => {
            selectedSentence.setShowTime(showTime);
            selectedSentence.setDuration(duration);
            setSelectedSentence(null);
          }}
        />
      )}
      <Typography variant="h4">Текст и время</Typography>
      <Button
        variant="contained"
        startIcon={<FileUploadIcon />}
        size="large"
        onClick={() => setLoadTextDialogOpen(true)}
      >
        Загрузить текст
      </Button>
      <Container sx={{ flex: 1, minHeight: 0, py: 2 }} maxWidth="xl">
        <SentenceList
          list={draft.sentences}
          onSelect={(sentence) => setSelectedSentence(sentence)}
        />
      </Container>
    </Stack>
  );
});
