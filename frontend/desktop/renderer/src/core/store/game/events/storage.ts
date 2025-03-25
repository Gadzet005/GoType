import { GameEvent } from "./types";

export class EventStorage {
    private events = new Map<number, GameEvent[]>();

    addEvent(tick: number, event: GameEvent) {
        const tickEvents = this.events.get(tick);
        if (tickEvents) {
            tickEvents.push(event);
        } else {
            this.events.set(tick, [event]);
        }
    }

    getEvents(tick: number): GameEvent[] {
        return this.events.get(tick) || [];
    }

    removeTickEvents(tick: number) {
        this.events.delete(tick);
    }

    removeAllEvents() {
        this.events.clear();
    }
}
