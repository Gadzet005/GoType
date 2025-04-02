import { ProgressBar } from "@/components/common/ProgressBar";
import { FieldSentence } from "@/core/store/game/core/fieldSentence";
import { Letter, LetterState } from "@/core/store/game/core/letter";
import { SentenceState } from "@/core/store/game/core/sentence";
import { SentenceColors } from "@desktop-common/level/style";
import { Box } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { LetterView } from "./LetterView";

interface SentenceProgress {
  state: SentenceState;
  intro: number;
  active: number;
  outro: number;
}

function getProgress(start: number, duration: number, now: number): number {
  if (duration === 0) {
    return 1;
  }
  return Math.min(Math.max(0, now - start) / duration, 1);
}

function getSentenceProgress(
  sentence: FieldSentence,
  time: number
): SentenceProgress {
  const intro = getProgress(sentence.introTime, sentence.introDuration, time);
  const active = getProgress(
    sentence.activeTime,
    sentence.activeDuration,
    time
  );
  const outro = getProgress(sentence.outroTime, sentence.outroDuration, time);
  return {
    state: sentence.getState(time),
    intro,
    active,
    outro,
  };
}

interface AnimationState {
  opacity: number;
  letterOpacity: (idx: number) => number;
}

function getAnimationState(
  progress: SentenceProgress,
  sentenceLength: number
): AnimationState {
  function getOpacity() {
    switch (progress.state) {
      case SentenceState.intro:
        return progress.intro;
      case SentenceState.outro:
        return 1 - progress.outro;
      default:
        return 1;
    }
  }

  function getLetterOpacity(idx: number) {
    switch (progress.state) {
      case SentenceState.intro:
        return Number(idx < sentenceLength * progress.intro);
      case SentenceState.outro:
        return 1 - Number(idx < sentenceLength * progress.outro);
      default:
        return 1;
    }
  }

  return { opacity: getOpacity(), letterOpacity: getLetterOpacity };
}

function getLetterColor(
  letter: Letter,
  colors: SentenceColors,
  isActive: boolean
) {
  if (isActive) {
    return colors.active;
  }
  switch (letter.state) {
    case LetterState.default:
      return colors.default;
    case LetterState.mistake:
      return colors.mistake;
    case LetterState.success:
      return colors.success;
  }
}

interface SentenceViewProps {
  sentence: FieldSentence;
  cursor: number | undefined;
  sentenceTime: number;
}

export const SentenceView: React.FC<SentenceViewProps> = observer(
  ({ sentence, cursor, sentenceTime }) => {
    const time = sentence.introTime + sentenceTime;
    const progress = getSentenceProgress(sentence, time);
    const animationState = getAnimationState(progress, sentence.length);

    const letterViews = React.useMemo(
      () =>
        sentence.letters.map((letter, i) => {
          const isActive = i == cursor;
          const color = getLetterColor(letter, sentence.style.colors, isActive);
          return (
            <LetterView
              key={i}
              letter={letter.char}
              color={color}
              fontSize={sentence.style.fontSize}
              font={sentence.style.font}
              bold={sentence.style.bold}
              opacity={animationState.letterOpacity(i)}
              isActive={isActive}
            />
          );
        }),
      [sentence, cursor, animationState]
    );

    return (
      <Box
        sx={{
          p: sentence.style.padding,
          bgcolor: sentence.style.bgcolor,
          borderRadius: sentence.style.borderRadius,
          rotate: `${sentence.style.rotation}deg`,
          opacity: animationState.opacity,
          transition: "opacity 500ms easy-in-out",
        }}
      >
        <Box>{letterViews}</Box>
        <ProgressBar
          value={progress.active * 100}
          sx={{
            borderRadius: 5,
            height: 7,
          }}
        />
      </Box>
    );
  }
);
