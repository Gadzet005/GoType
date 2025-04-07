import { Box, Typography } from "@mui/material";
import { useEditorContext } from "../../context";
import { observer } from "mobx-react";
import { CenterBox } from "@/components/common/CenterBox";
import React from "react";
import { AudioPlayerView } from "@/components/common/AudioPlayerView";
import { useAudioTime } from "@/core/hooks/useAudioTime";
import { EditorGameView } from "./EditorGameView";
import { DraftSentence } from "../../store/draftSentence";
import { EditSentenceDialog } from "./EditSentenceDialog";

export const FieldEditor = observer(() => {
  const { draft, audioPlayer } = useEditorContext();
  const time = useAudioTime(audioPlayer);

  const [selectedSentence, setSelectedSentence] =
    React.useState<DraftSentence | null>(null);

  React.useEffect(() => {
    audioPlayer.seek(0);
    return () => {
      audioPlayer.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!draft.audio || !draft.background) {
    return (
      <CenterBox>
        <Typography variant="h5">
          Загрузите аудио файл и фон, чтобы страница стала доступна
        </Typography>
      </CenterBox>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {selectedSentence && (
        <EditSentenceDialog
          open
          onClose={() => setSelectedSentence(null)}
          sentence={selectedSentence}
        />
      )}
      <Box sx={{ flex: 1 }}>
        <EditorGameView
          sentences={draft.sentences}
          time={time * 1000}
          background={{
            asset: draft.background.asset!,
            brightness: draft.background.brightness,
          }}
          onSelect={(sentence) => {
            audioPlayer.pause();
            setSelectedSentence(sentence);
          }}
        />
      </Box>
      <Box sx={{ width: "100%", px: 3, py: 1 }}>
        <AudioPlayerView player={audioPlayer} step={0.1} />
      </Box>
    </Box>
  );
});
