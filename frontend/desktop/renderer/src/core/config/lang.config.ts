import { LanguageInfo } from "../types/language";

export const LANGUAGES: LanguageInfo[] = [
    {
        code: "eng",
        name: "English",
        alphabet: "abcdefghijklmnopqrstuvwxyz",
    },
    {
        code: "rus",
        name: "Русский",
        alphabet: "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
    },
];

export const DEFAULT_LANGUAGE_CODE = "eng";
