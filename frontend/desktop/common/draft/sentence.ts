export interface DraftSentenceInfo {
    content: string;
    coord: {
        x: number;
        y: number;
    };

    showTime?: number;
    duration?: number;
    styleClass?: string;
}
