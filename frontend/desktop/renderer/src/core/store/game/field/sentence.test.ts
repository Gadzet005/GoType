import { createDummySentence } from "@tests/dummy/sentence";
import { Sentence } from "./sentence";

it("Sentence unit", () => {
    const sentenceInfo = createDummySentence("hello");
    const sentence = new Sentence(0, sentenceInfo);

    expect(sentence.length).toBe(sentenceInfo.content.length);
    expect(sentence.coord).toBe(sentenceInfo.coord);
    expect(sentence.duration).toBe(sentenceInfo.duration);
    expect(sentence.style).toBe(sentenceInfo.style);
    expect(sentence.introTime).toBe(sentenceInfo.showTime);

    for (let i = 0; i < sentence.length; i++) {
        const letter = sentence.getLetter(i);
        expect(letter.char).toBe(sentenceInfo.content[i]);
    }
});
