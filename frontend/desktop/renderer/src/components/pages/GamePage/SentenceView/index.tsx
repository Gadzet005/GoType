import { TICK_TIME } from "@/core/store/game/consts";
import { GameFieldSentence } from "@/core/store/game/field/sentence";
import { FadeAnimation } from "@desktop-common/sentence/style";
import { Box } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import ResizeObserver from "resize-observer-polyfill";
import { useIsPaused } from "../pause";
import { LetterView } from "./LetterView";
import useMeasure from "react-use-measure";

import "./fade.css";

interface SentenceViewProps {
  sentence: GameFieldSentence;
  fieldHeight: number;
  fieldWidth: number;
}

function getFadeStep(fadeAnimation: FadeAnimation, length: number): number {
  return (fadeAnimation.duration - fadeAnimation.letterDuration) / length;
}

function getAbsoluteCoord(
  relative: number,
  fieldSize: number,
  sentenceSize: number
): number {
  return (relative * (fieldSize - sentenceSize)) / 100;
}

export const SentenceView: React.FC<SentenceViewProps> = observer(
  ({ sentence, fieldHeight, fieldWidth }) => {
    const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });
    const x = getAbsoluteCoord(sentence.coord.x, fieldWidth, bounds.width);
    const y = getAbsoluteCoord(sentence.coord.y, fieldHeight, bounds.height);

    const isPaused = useIsPaused();
    const [activeLetters, setActiveLetters] = React.useState(0);
    React.useEffect(() => {
      const letterInterval =
        (sentence.duration * TICK_TIME) / sentence.content.length;
      if (isPaused) return;
      const intervalId = setInterval(() => {
        setActiveLetters((value) => {
          if (value === sentence.content.length) {
            clearInterval(intervalId);
            return value;
          }
          return value + 1;
        });
      }, letterInterval);
      return () => clearInterval(intervalId);
    }, [isPaused, sentence.content.length, sentence.duration]);

    const animations = sentence.style.animations;
    const fadeInStep = getFadeStep(animations.fadeIn, sentence.content.length);
    const fadeOutStep = getFadeStep(
      animations.fadeOut,
      sentence.content.length
    );

    const letterViews = sentence.content.split("").map((letter, i) => {
      const style = sentence.getLetterStyle(i);
      const fadeInTime = i * fadeInStep;
      const fadeOutTime =
        sentence.duration * TICK_TIME -
        animations.fadeIn.duration +
        i * fadeOutStep;
      return (
        <LetterView
          key={i}
          letter={letter}
          style={style}
          useUnderline={i < activeLetters}
          fadeIn={{
            time: fadeInTime,
            duration: animations.fadeIn.letterDuration,
            easing: animations.fadeIn.easing,
          }}
          fadeOut={{
            time: fadeOutTime,
            duration: animations.fadeOut.letterDuration,
            easing: animations.fadeOut.easing,
          }}
        />
      );
    });

    const fadeOutDelay =
      sentence.duration * TICK_TIME - animations.fadeOut.duration;

    return (
      <Box
        sx={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          opacity: 0,
          p: sentence.style.padding,
          bgcolor: sentence.style.bgcolor,
          borderRadius: sentence.style.borderRadius,
          rotate: `${sentence.style.rotate}deg`,
          animation: `
            fadeIn 
            ${animations.fadeIn.duration}ms 
            ${animations.fadeIn.easing} 
            0ms 
            forwards,

            fadeIn 
            ${animations.fadeIn.duration}ms 
            ${animations.fadeOut.easing}
            ${fadeOutDelay}ms
            forwards reverse
          `,
          animationPlayState: isPaused ? "paused" : "running",
        }}
        ref={ref}
      >
        {letterViews}
      </Box>
    );
  }
);
