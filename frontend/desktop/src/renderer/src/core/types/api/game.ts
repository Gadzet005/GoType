export namespace SendSingleGameResults {
    export interface Args {
        level_id: number;
        player_id: number;
        max_combo: number;
        average_velocity: number;
        placement: number;
        points: number;
        num_press_err_by_char: { [key: string]: [number, number] };
    }
}
