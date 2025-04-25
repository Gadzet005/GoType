export interface DraftSentenceData {
    content: string;
    coord: {
        x: number;
        y: number;
    };
    rotation: number;

    showTime: number | null;
    duration: number | null;
    styleClassName: string | null;
}
