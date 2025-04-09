import React from "react";
import { AudioPlayer } from "react-use-audio-player";

export function useAudioTime(player: AudioPlayer) {
    const frameRef = React.useRef<number>();
    const [pos, setPos] = React.useState(0);

    React.useEffect(() => {
        const animate = () => {
            setPos(player.getPosition());
            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = window.requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [player]);

    return pos;
}
