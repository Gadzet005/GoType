import { EventStorage } from "@/core/store/game/events/storage";
import { GameEvent } from "@/core/store/game/events/interface";

class DoNothingEvent implements GameEvent {
    run(): void {}
}

describe("EventStorage tests", () => {
    const tick = 123;

    it("EventStorage.addEvent", () => {
        const manager = new EventStorage();

        manager.addEvent(tick, new DoNothingEvent());
        manager.addEvent(tick, new DoNothingEvent());
        manager.addEvent(tick + 1, new DoNothingEvent());

        expect(manager.getEvents(tick)).lengthOf(2);
        expect(manager.getEvents(tick + 1)).lengthOf(1);
    });

    it("EventStorage.removeTickEvents", () => {
        const manager = new EventStorage();

        manager.addEvent(tick, new DoNothingEvent());
        manager.addEvent(tick + 1, new DoNothingEvent());

        manager.removeTickEvents(tick);

        expect(manager.getEvents(tick)).lengthOf(0);
        expect(manager.getEvents(tick + 1)).lengthOf(1);
    });

    it("EventStorage.removeAllEvents", () => {
        const manager = new EventStorage();

        manager.addEvent(tick, new DoNothingEvent());
        manager.addEvent(tick + 1, new DoNothingEvent());

        manager.removeAllEvents();

        expect(manager.getEvents(tick)).lengthOf(0);
        expect(manager.getEvents(tick + 1)).lengthOf(0);
    });
});
