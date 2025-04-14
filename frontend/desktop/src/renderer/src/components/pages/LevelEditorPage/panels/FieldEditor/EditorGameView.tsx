import { Box } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import useMeasure from "react-use-measure";
import ResizeObserver from "resize-observer-polyfill";
import { AssetRef } from "@common/asset";
import { Background } from "@/components/common/Background";
import { SentenceView } from "@/components/game/SentenceView";
import { DraftSentence } from "../../store/draftSentence";
import { DraggableSentenceContainer } from "./DraggableSentenceContainer";
import { useEditorContext } from "../../context";

interface EditorGameViewProps {
  sentences: DraftSentence[];
  time: number;
  background: {
    asset: AssetRef;
    brightness?: number;
  };
  onReadyToStart?: () => void;
  fullScreen?: boolean;
  onSelect?: (sentence: DraftSentence) => void;
}

export const EditorGameView: React.FC<EditorGameViewProps> = observer(
  ({
    sentences,
    time,
    background,
    fullScreen = false,
    onReadyToStart = () => {},
    onSelect,
  }) => {
    const { draft } = useEditorContext();
    const [ref, bounds] = useMeasure({ polyfill: ResizeObserver });

    const SentenceViews = React.useMemo(
      () =>
        sentences.map((sentence) => {
          const fieldSentence = sentence.toFieldSentence();
          if (!fieldSentence?.isVisible(time)) {
            return null;
          }

          return (
            <DraggableSentenceContainer
              key={fieldSentence.idx}
              sentence={sentence}
              fieldHeight={bounds.height}
              fieldWidth={bounds.width}
              onDoubleClick={() => onSelect && onSelect(sentence)}
            >
              <SentenceView
                sentence={fieldSentence}
                sentenceTime={fieldSentence.getRelativeTime(time)}
              />
            </DraggableSentenceContainer>
          );
        }),
      [bounds.height, bounds.width, onSelect, sentences, time]
    );

    const bgURL = background.asset.url + `?v=${draft.updateTime}`;

    return (
      <Box
        sx={{
          position: fullScreen ? "static" : "relative",
          height: "100%",
          p: 2,
          overflow: "hidden",
        }}
      >
        <Background
          imageUrl={bgURL}
          brightness={background.brightness}
          onLoad={() => onReadyToStart()}
        />
        <Box ref={ref} sx={{ position: "relative" }} height="100%" width="100%">
          {SentenceViews}
        </Box>
      </Box>
    );
  }
);
