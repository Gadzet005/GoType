import { tick } from "@desktop-common/types";
import { GameEvent } from "./interface";
import { action, makeObservable, observable } from "mobx";

export class EventStorage {
    private events = new Map<tick, GameEvent[]>();

    constructor() {
        makeObservable(this, {
            // @ts-expect-error: private observable
            events: observable.shallow,
            addEvent: action,
            removeTickEvents: action,
            removeAllEvents: action,
        });
    }

    addEvent(tick: tick, event: GameEvent) {
        const tickEvents = this.events.get(tick);
        if (tickEvents) {
            tickEvents.push(event);
        } else {
            this.events.set(tick, [event]);
        }
    }

    getEvents(tick: tick): GameEvent[] {
        return this.events.get(tick) || [];
    }

    removeTickEvents(tick: tick) {
        this.events.delete(tick);
    }

    removeAllEvents() {
        this.events.clear();
    }
}
