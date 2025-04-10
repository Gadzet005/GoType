import { Asset } from "@common/asset";
import React from "react";
import { useAudioPlayer } from "react-use-audio-player";

export function useAutoLoadAudioPlayer(asset?: Asset) {
    const audioPlayer = useAudioPlayer();

    React.useEffect(() => {
        if (!asset) {
            return;
        }

        audioPlayer.load(asset.url, {
            autoplay: false,
            loop: false,
            format: asset.ext,
        });
        return () => audioPlayer.cleanup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [asset]);

    return audioPlayer;
}
