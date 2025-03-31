import { ProgressBar } from "@/components/common/ProgressBar";
import { Sentence, SentenceState } from "@/core/store/game/field/sentence";
import { Box } from "@mui/material";
import { animated, useSpring, useTrail } from "@react-spring/web";
import { when } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import { useIsPaused } from "../pause";
import { LetterView } from "./LetterView";

const AnimatedBox = animated(Box);

interface SentenceViewProps {
  sentence: Sentence;
  cursor: number | undefined;
  progress: number;
}

export const SentenceView: React.FC<SentenceViewProps> = observer(
  ({ sentence, cursor, progress }) => {
    const isPaused = useIsPaused();

    const [animationProps, animationAPI] = useSpring(
      { from: { opacity: 0 } },
      []
    );
    const [letterTrails, letterTrailsAPI] = useTrail(
      sentence.length,
      {
        from: { opacity: 0 },
      },
      []
    );

    React.useEffect(() => {
      const introDuration = sentence.introDuration;
      const outroDuration = sentence.outroDuration;
      const introLetterDuration = Math.max(50, introDuration / sentence.length);
      const outroLetterDuration = Math.max(30, outroDuration / sentence.length);

      animationAPI.start({
        to: { opacity: 1 },
        config: { duration: introDuration },
      });
      letterTrailsAPI.start({
        to: { opacity: 1 },
        config: { duration: introLetterDuration },
      });

      when(
        () => sentence.state == SentenceState.outro,
        () => {
          animationAPI.start({
            to: { opacity: 0 },
            config: { duration: outroDuration },
          });
          letterTrailsAPI.start({
            to: { opacity: 0 },
            config: { duration: outroLetterDuration },
          });
        }
      );

      return () => {
        animationAPI.stop();
        letterTrailsAPI.stop();
      };
    }, [sentence, animationAPI, letterTrailsAPI]);

    React.useEffect(() => {
      if (isPaused) {
        animationAPI.pause();
        letterTrailsAPI.pause();
      } else {
        animationAPI.resume();
        letterTrailsAPI.resume();
      }
    }, [isPaused, animationAPI, letterTrailsAPI]);

    const letterViews = React.useMemo(
      () =>
        sentence.getLetters().map((letter, i) => {
          const isActive = i == cursor;
          return (
            <AnimatedBox
              key={i} // NOSONAR: sentence size and letter indexes are fixed
              // @ts-expect-error: it's ok
              component="span"
              style={letterTrails[i]}
            >
              <LetterView
                letter={letter.char}
                style={letter.getStyle(isActive)}
              />
            </AnimatedBox>
          );
        }),
      [sentence, letterTrails, cursor]
    );

    return (
      <AnimatedBox
        sx={{
          p: sentence.style.padding,
          bgcolor: sentence.style.bgcolor,
          borderRadius: sentence.style.borderRadius,
          rotate: `${sentence.style.rotation}deg`,
        }}
        style={{ ...animationProps }}
      >
        <Box>{letterViews}</Box>
        <ProgressBar
          value={progress}
          sx={{
            borderRadius: 5,
            height: 7,
          }}
        />
      </AnimatedBox>
    );
  }
);
