import { StyleClass } from "@desktop-common/draft/style";
import { LetterStyle } from "@desktop-common/level/style";

export interface StyleFormValues {
    name: string;

    padding: number;
    bgcolor: string | null;
    rotation: number;
    borderRadius: number;

    default: LetterStyle;
    active: LetterStyle;
    mistake: LetterStyle;
    success: LetterStyle;
}

export function toValues(styleClass: StyleClass): StyleFormValues {
    return {
        name: styleClass.name,
        padding: styleClass.style.padding,
        bgcolor: styleClass.style.bgcolor ?? null,
        rotation: styleClass.style.rotation,
        borderRadius: styleClass.style.borderRadius,

        default: styleClass.style.letter.default,
        active: styleClass.style.letter.active,
        mistake: styleClass.style.letter.mistake,
        success: styleClass.style.letter.success,
    };
}

export function fromValues(values: StyleFormValues): StyleClass {
    return {
        name: values.name,
        style: {
            padding: values.padding,
            bgcolor: values.bgcolor ?? undefined,
            rotation: values.rotation,
            borderRadius: values.borderRadius,

            letter: {
                default: values.default,
                active: values.active,
                mistake: values.mistake,
                success: values.success,
            },
        },
    };
}
