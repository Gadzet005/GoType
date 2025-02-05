import { GameState } from "../state";

export interface GameEvent {
    run(state: GameState): void;
}
