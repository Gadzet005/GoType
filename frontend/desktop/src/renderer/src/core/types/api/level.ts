export namespace LevelAPI {
    export interface CreationData {
        id?: number;
        name: string;
        description: string;
        author: number;
        author_name: string;
        duration: number;
        tags: string[];
        language: string;
        type: string;
        difficulty: number;
        image_type: string;
    }
}
