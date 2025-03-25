import { GameField } from "../field";

export interface GameEvent {
    run(field: GameField): void;
}
