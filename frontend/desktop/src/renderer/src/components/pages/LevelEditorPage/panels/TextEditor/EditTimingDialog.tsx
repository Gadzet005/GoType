import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { AudioPlayer } from "react-use-audio-player";
import { timeView } from "./utils";
import { Mark } from "@mui/material/Slider/useSlider.types";
import { useAudioTime } from "@/core/hooks/useAudioTime";
import { AudioPlayerView } from "@/components/common/AudioPlayerView";

function toSeconds(t: number | null) {
  return t && Math.round(t / 1000);
}

function toMilliseconds(t: number | null) {
  return t && Math.round(t * 1000);
}

function getMarks(showTime: number | null, duration: number | null) {
  const marks: Mark[] = [];
  if (showTime) {
    marks.push({
      value: showTime,
      label: timeView(toMilliseconds(showTime)),
    });
  }
  if (showTime && duration) {
    marks.push({
      value: showTime + duration,
      label: duration < 8 ? "" : timeView(toMilliseconds(showTime + duration)),
    });
  }
  return marks;
}

enum ChoiceStep {
  showTime,
  duration,
  done,
}

interface EditTimingDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (showTime: number | null, duration: number | null) => void;
  content: string;
  showTime: number | null;
  duration: number | null;
  player: AudioPlayer;
}

export const EditTimingDialog: React.FC<EditTimingDialogProps> = ({
  open,
  onClose,
  onSave,
  content,
  showTime: initialShowTime,
  duration: initialDuration,
  player,
}) => {
  const time = useAudioTime(player);

  const [step, setStep] = React.useState<ChoiceStep>(ChoiceStep.showTime);
  const [showTime, setShowTime] = React.useState(toSeconds(initialShowTime));
  const [duration, setDuration] = React.useState(toSeconds(initialDuration));

  React.useEffect(() => {
    if (open) {
      player.seek(toSeconds(initialShowTime) ?? 0);
    }
    return () => {
      player.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle variant="h4">{content}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 5, pr: 3 }}>
          <AudioPlayerView
            player={player}
            onPlay={() => setStep(ChoiceStep.showTime)}
            valueLabelFormat={(value) => timeView(toMilliseconds(value))}
            valueLabelDisplay="on"
            marks={getMarks(showTime, duration)}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <Button
            disabled={step === ChoiceStep.done || player.paused}
            variant="contained"
            onClick={() => {
              if (step === ChoiceStep.showTime) {
                setShowTime(time);
                setDuration(null);
                setStep(ChoiceStep.duration);
              } else if (step === ChoiceStep.duration) {
                const duration = time - showTime!;
                if (duration > 0) {
                  setDuration(time - showTime!);
                  setStep(ChoiceStep.done);
                } else {
                  setShowTime(time);
                }
              }
            }}
          >
            Установить {step === ChoiceStep.showTime ? "начало" : "конец"}
          </Button>
        </Box>
        <DialogContentText>
          Для того, чтобы разметить начало и конец предложения, запустите плеер,
          затем нажмите на кнопку выше, когда придет время начала и окончания
          предложения.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Закрыть
        </Button>
        <Button
          color="primary"
          variant="contained"
          type="submit"
          onClick={() =>
            onSave(toMilliseconds(showTime), toMilliseconds(duration))
          }
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
