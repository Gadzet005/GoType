import { Letter } from "./letter";
import { Defaults } from "@/core/config/game.config";

describe("Letter Tests", () => {
    const styles = Defaults.sentenceStyle.letter;

    it("isEqual", () => {
        const letter1 = new Letter("a", styles);
        const letter2 = new Letter("A", styles);

        expect(letter1.isEqual("a")).toBe(true);
        expect(letter1.isEqual("A")).toBe(true);
        expect(letter1.isEqual("b")).toBe(false);
        expect(letter2.isEqual("a")).toBe(true);
        expect(letter2.isEqual("A")).toBe(true);
        expect(letter2.isEqual("asd")).toBe(false);
    });

    it("getStyle", () => {
        const letter1 = new Letter("a", styles);
        const letter2 = new Letter("b", styles);
        const letter3 = new Letter("c", styles);

        letter2.mistake();
        letter3.success();

        expect(letter1.getStyle()).toEqual(styles.default);
        expect(letter1.getStyle(true)).toEqual(styles.active);
        expect(letter2.getStyle()).toEqual(styles.mistake);
        expect(letter3.getStyle()).toEqual(styles.success);
    });
});
