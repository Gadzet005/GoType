export interface DraftSentence {
    content: string;
    coord: {
        x: number;
        y: number;
    };

    showTime?: number;
    duration?: number;
    styleClass?: string;
}
