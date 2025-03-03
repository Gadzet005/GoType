export namespace AllowedAssetExtensions {
    export const PICTURE = ["png", "jpg", "jpeg"];
    export const VIDEO = ["mp4"];
    export const AUDIO = ["mp3", "wav"];
    export const BACKGROUND = [...PICTURE, ...VIDEO];
    export const PREVIEW = PICTURE;
}
