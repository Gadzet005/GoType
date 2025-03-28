import { EventStorage } from "@/core/store/game/events/storage";
import { GameEvent } from "@/core/store/game/events/types";

class DoNothingEvent implements GameEvent {
    run() {
        // Do nothing
    }
    priority() {
        return 0;
    }
}

class ImportantEvent implements GameEvent {
    run() {
        // Do something important
    }

    priority() {
        return 1;
    }
}

describe("EventStorage tests", () => {
    it("EventStorage addEvent and getEventsBefore", () => {
        const storage = new EventStorage();

        storage.addEvent(0, new DoNothingEvent());
        storage.addEvent(0, new DoNothingEvent());
        storage.addEvent(1, new DoNothingEvent());

        expect(storage.getEventsBefore(-1)).lengthOf(0);
        expect(storage.getEventsBefore(0)).lengthOf(2);
        expect(storage.getEventsBefore(1)).lengthOf(1);
        expect(storage.getEventsBefore(100)).lengthOf(0);
    });

    it("EventStorage clear", () => {
        const storage = new EventStorage();

        storage.addEvent(0, new DoNothingEvent());
        storage.addEvent(1, new DoNothingEvent());

        storage.clear();

        expect(storage.getEventsBefore(0)).lengthOf(0);
        expect(storage.getEventsBefore(1)).lengthOf(0);
    });

    it("EventStorage priority", () => {
        const storage = new EventStorage();

        storage.addEvent(0, new DoNothingEvent());
        storage.addEvent(1, new DoNothingEvent());
        storage.addEvent(1, new ImportantEvent());
        storage.addEvent(1, new DoNothingEvent());
        storage.addEvent(2, new DoNothingEvent());
        storage.addEvent(1000, new ImportantEvent());

        const events = storage.getEventsBefore(1000);
        expect(events[0]).toBeInstanceOf(ImportantEvent);
        expect(events[1]).toBeInstanceOf(ImportantEvent);
        expect(events[2]).toBeInstanceOf(DoNothingEvent);
        expect(events[3]).toBeInstanceOf(DoNothingEvent);
        expect(events[4]).toBeInstanceOf(DoNothingEvent);
        expect(events[5]).toBeInstanceOf(DoNothingEvent);
    });
});
