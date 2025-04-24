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
  const [shouldContinue, setShouldContinue] = React.useState(false);
  const time = useAudioTime(player);

  React.useEffect(() => {
    if (onTimeChange) {
      onTimeChange(time * 1000);
    }
  }, [onTimeChange, time]);

  const handleSliderChange = (value: number) => {
    if (player.playing) {
      player.pause();
      setShouldContinue(true);
    }
    player.seek(value);
  };

  const handleSliderChangeCommitted = (value: number) => {
    if (shouldContinue) {
      player.play();
      setShouldContinue(false);
    }
    player.seek(value);
  };

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
        onChange={(_, value) => handleSliderChange(value as number)}
        onChangeCommitted={(_, value) =>
          handleSliderChangeCommitted(value as number)
        }
        {...other}
      />
    </Box>
  );
};
