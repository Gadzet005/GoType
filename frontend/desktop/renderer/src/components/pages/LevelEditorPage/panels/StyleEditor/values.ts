import { StyleClassData } from "@desktop-common/draft/style";

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

export function toValues(styleClass: StyleClassData): StyleFormValues {
    return {
        name: styleClass.name,
        padding: styleClass.padding,
        bgcolor: styleClass.bgcolor ?? null,
        rotation: styleClass.rotation,
        borderRadius: styleClass.borderRadius,
        introDurationPercent: styleClass.introDurationRatio * 100,
        outroDurationPercent: styleClass.outroDurationRatio * 100,
        font: styleClass.font,
        fontSize: styleClass.fontSize,
        bold: styleClass.bold,
        colors: {
            default: styleClass.colors.default,
            active: styleClass.colors.active,
            mistake: styleClass.colors.mistake,
            success: styleClass.colors.success,
        },
    };
}

export function fromValues(values: StyleFormValues): StyleClassData {
    return {
        name: values.name,
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
    };
}
