import { Box } from "@mui/material";
import React from "react";

interface BackgroundProps {
  imageUrl: string;
  zIndex?: number;
  brightness?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export const Background: React.FC<BackgroundProps> = React.memo(
  ({
    imageUrl,
    zIndex = -100,
    brightness = 0.5,
    onLoad = () => {},
    onError = () => {},
  }) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const bgRef = React.useRef<HTMLImageElement | null>(null);

    React.useEffect(() => {
      const img = new Image();
      bgRef.current = img;

      img.src = imageUrl;

      img.onload = () => {
        setIsLoaded(true);
        onLoad();
      };

      img.onerror = (e) => {
        console.error(`Failed to load background image: ${imageUrl}`, e);
        onError();
      };

      return () => {
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.src = "";
        }
      };
    }, [imageUrl]);

    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          zIndex: zIndex,
        }}
      >
        {isLoaded && (
          <img
            src={imageUrl}
            alt="background"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: brightness,
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `rgba(0, 0, 0, ${1 - brightness})`,
          }}
        />
      </Box>
    );
  }
);
