import { SentenceLetterStyles } from "@desktop-common/level/style";
import { Letter } from "./letter";

describe("Letter Tests", () => {
    const styles: SentenceLetterStyles = {
        default: { color: "black", fontSize: 1 },
        active: { color: "blue", fontSize: 10 },
        mistake: { color: "red" },
        success: { color: "green" },
    };

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

        expect(letter1.getStyle().color).toBe("black");
        expect(letter1.getStyle(true).color).toBe("blue");
        expect(letter2.getStyle().color).toBe("red");
        expect(letter3.getStyle().color).toBe("green");

        expect(letter1.getStyle().fontSize).toBe(1);
        expect(letter1.getStyle(true).fontSize).toBe(10);
        expect(letter2.getStyle().fontSize).toBe(1);
        expect(letter3.getStyle().fontSize).toBe(1);
    });
});
