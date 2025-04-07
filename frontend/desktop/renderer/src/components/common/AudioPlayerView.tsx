import { Box, IconButton, Slider, SliderProps } from "@mui/material";
import { AudioPlayer } from "react-use-audio-player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useAudioTime } from "@/core/hooks/useAudioTime";
import React from "react";

export interface AudioPlayerViewProps extends SliderProps {
  player: AudioPlayer;
  onPause?: () => void;
  onPlay?: () => void;
  onTimeChange?: (time: number) => void;
}

export const AudioPlayerView: React.FC<AudioPlayerViewProps> = ({
  player,
  onPause,
  onPlay,
  onTimeChange,
  ...other
}) => {
  const time = useAudioTime(player);

  React.useEffect(() => {
    if (onTimeChange) {
      onTimeChange(time * 1000);
    }
  }, [onTimeChange, time]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <IconButton
        onClick={() => {
          if (player.playing) {
            player.pause();
            if (onPause) {
              onPause();
            }
          } else {
            player.play();
            if (onPlay) {
              onPlay();
            }
          }
        }}
      >
        {player.playing ? (
          <PauseIcon fontSize="large" />
        ) : (
          <PlayArrowIcon fontSize="large" />
        )}
      </IconButton>
      <Slider
        size="medium"
        value={time}
        min={0}
        max={Math.round(player.duration)}
        step={1}
        onChange={(_, value) => {
          player.seek(value as number);
        }}
        {...other}
      />
    </Box>
  );
};
