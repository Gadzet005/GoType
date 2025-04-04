export interface DraftSentenceInfo {
    content: string;
    coord: {
        x: number;
        y: number;
    };

    showTime: number | null;
    duration: number | null;
    styleClass: string | null;
}
