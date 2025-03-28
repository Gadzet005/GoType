import { GameEvent } from "./types";
import { Heap } from "heap-js";

interface EventRecord {
    time: number;
    event: GameEvent;
}

export class EventStorage {
    private events = new Heap<EventRecord>(
        (a: EventRecord, b: EventRecord) => a.time - b.time
    );

    addEvent(time: number, event: GameEvent) {
        this.events.push({ time, event });
    }

    getEventsBefore(time: number): GameEvent[] {
        const events = [];
        while (!this.events.isEmpty() && this.events.peek()!.time <= time) {
            events.push(this.events.pop()!.event);
        }
        events.sort((a, b) => b.priority() - a.priority());
        return events;
    }

    clear() {
        this.events.clear();
    }
}
