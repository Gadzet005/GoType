import { StyleClassData } from "@desktop-common/draft/style";
import { SentenceData } from "@desktop-common/level/sentence";

export type CoreSentenceData = Omit<SentenceData, "style">;

export type StyleClass = Omit<StyleClassData, "name">;
export type NamedStyleClass = StyleClass & { name: string };
