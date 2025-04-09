import { StyleClassData } from "@common/draft/style";
import { SentenceData } from "@common/level/sentence";

export type CoreSentenceData = Omit<SentenceData, "style">;

export type StyleClass = Omit<StyleClassData, "name">;
export type NamedStyleClass = StyleClass & { name: string };
