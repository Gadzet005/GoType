import { LANGUAGES, DEFAULT_LANGUAGE_CODE } from "@/core/config/lang.config";
import { LanguageInfo } from "../types/language";

export class Language implements LanguageInfo {
    static readonly languages: Map<string, LanguageInfo> =
        Language.getLanguageMap();

    private static getLanguageMap(): Map<string, LanguageInfo> {
        const result = new Map<string, LanguageInfo>();
        LANGUAGES.forEach((lang) => result.set(lang.code, lang));
        return result;
    }

    static byCode(code: string): Language | null {
        const langInfo = Language.languages.get(code);
        return langInfo ? new Language(langInfo) : null;
    }

    static default(): Language {
        const lang = this.byCode(DEFAULT_LANGUAGE_CODE);
        if (!lang) {
            throw new Error("Default language not found");
        }
        return lang;
    }

    readonly code: string;
    readonly name: string;
    readonly alphabet: string;

    constructor(langInfo: LanguageInfo) {
        this.code = langInfo.code;
        this.name = langInfo.name;
        this.alphabet = langInfo.alphabet;
    }

    includes(letter: string): boolean {
        return this.alphabet.includes(letter.toLowerCase());
    }
}
