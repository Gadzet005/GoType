import { Asset } from "@desktop-common/asset";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { useAudioPlayer } from "react-use-audio-player";

interface EditTimingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (showTime: number | null, duration: number | null) => void;
  audio: Asset;
  content: string;
  showTime: number | null;
  duration: number | null;
}

export const EditTimingDialog: React.FC<EditTimingDialogProps> = ({
  open,
  onClose,
  onSave,
  audio,
  content,
  showTime: initialShowTime,
  duration: initialDuration,
}) => {
  const audioPlayer = useAudioPlayer();

  const [showTime] = React.useState(initialShowTime);
  const [duration] = React.useState(initialDuration);

  React.useEffect(() => {
    audioPlayer.load(audio.url, {
      autoplay: false,
      loop: false,
      format: audio.ext,
    });
    return () => audioPlayer.cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant="h4">{content}</DialogTitle>
      <DialogContent>{audioPlayer.isReady && <></>}</DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Закрыть
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => onSave(showTime, duration)}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
