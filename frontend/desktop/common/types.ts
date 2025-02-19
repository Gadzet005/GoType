export type tick = number;
export type second = number;
export type millisecond = number;
export type percent = number;

export namespace AssetTypes {
    export type PictureType = "png" | "jpeg" | "jpg";
    export type VideoType = "mp4";
    export type AudioType = "mp3";
    export type BackgroundType = PictureType | VideoType;
}

export type Asset<T> = {
    type: T;
    url: string;
};

export type AnimationEasing =
    | "linear"
    | "ease"
    | "ease-out"
    | "ease-in"
    | "ease-in-out";
