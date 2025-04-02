import { StyleClass } from "@desktop-common/draft/style";

export interface StyleFormValues {
    name: string;

    padding: number;
    bgcolor: string | null;
    rotation: number;
    borderRadius: number;

    introDurationPercent: number;
    outroDurationPercent: number;

    font: string;
    fontSize: number;
    bold: boolean;

    colors: {
        default: string;
        active: string;
        mistake: string;
        success: string;
    };
}

export function toValues(styleClass: StyleClass): StyleFormValues {
    return {
        name: styleClass.name,
        padding: styleClass.style.padding,
        bgcolor: styleClass.style.bgcolor ?? null,
        rotation: styleClass.style.rotation,
        borderRadius: styleClass.style.borderRadius,
        introDurationPercent: styleClass.style.introDurationRatio * 100,
        outroDurationPercent: styleClass.style.outroDurationRatio * 100,
        font: styleClass.style.font,
        fontSize: styleClass.style.fontSize,
        bold: styleClass.style.bold,
        colors: {
            default: styleClass.style.colors.default,
            active: styleClass.style.colors.active,
            mistake: styleClass.style.colors.mistake,
            success: styleClass.style.colors.success,
        },
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
            font: values.font,
            fontSize: values.fontSize,
            bold: values.bold,
            introDurationRatio: values.introDurationPercent / 100,
            outroDurationRatio: values.outroDurationPercent / 100,
            colors: {
                default: values.colors.default,
                active: values.colors.active,
                mistake: values.colors.mistake,
                success: values.colors.success,
            },
        },
    };
}
