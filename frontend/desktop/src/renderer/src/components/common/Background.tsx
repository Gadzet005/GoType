import { Box } from "@mui/material";
import React from "react";

interface BackgroundProps {
  imageUrl: string;
  zIndex?: number;
  brightness?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export const Background: React.FC<BackgroundProps> = ({
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
    img.onerror = () => {
      onError();
    };

    return () => {
      if (img) {
        img.onload = null;
        img.onerror = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: isLoaded ? `url(${imageUrl})` : "",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: zIndex,
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${1 - brightness})`,
        },
      }}
    />
  );
};
