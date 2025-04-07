import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { useSnackbar } from "@/core/hooks";
import { getDraft } from "@/core/services/electron/draft/getDraft";
import { updateDraft } from "@/core/services/electron/draft/updateDraft";
import { truncateString } from "@/core/utils/string";
import { DraftUpdateData } from "@desktop-common/draft";
import { Box, IconButton, Tabs, Typography } from "@mui/material";
import structuredClone from "@ungap/structured-clone";
import { observer } from "mobx-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { EditorContext, UpdateDraftOptions } from "./context";
import { FieldEditor } from "./panels/FieldEditor";
import { Settings } from "./panels/Settings";
import { StyleEditor } from "./panels/StyleEditor";
import { TextEditor } from "./panels/TextEditor";
import { Draft } from "./store/draft";
import { EditorTab } from "./utils/EditorTab";
import { EditorTabPanel } from "./utils/EditorTabPanel";
import FolderIcon from "@mui/icons-material/Folder";
import { openDraftDir } from "@/core/services/electron/draft/openDraftDir";
import { useAutoLoadAudioPlayer } from "@/core/hooks/useAutoLoadAudioPlayer";

interface LevelEditorPageProps {
  draftId: number;
  initialTab?: number;
}

export const LevelEditorPage: React.FC<LevelEditorPageProps> = observer(
  ({ draftId, initialTab = 0 }) => {
    const snakbar = useSnackbar();

    const [curTab, setCurTab] = React.useState(initialTab);
    const [draft, setDraft] = React.useState<Draft | null>(null);
    const audioPlayer = useAutoLoadAudioPlayer(draft?.audio ?? undefined);

    const update = React.useCallback(
      async (options?: UpdateDraftOptions) => {
        if (!draft) {
          return;
        }

        const updateInfo: DraftUpdateData = {
          id: draft.id,
          name: draft.name,
          sentences: draft.sentences.map((s) => s.toDraftSentenceData()),
          styleClasses: structuredClone(draft.styleClasses.getAll(), {
            lossy: true,
          }),
          languageCode: draft.language.code,
          audioPath: options?.newAudioFile,
          background: {
            path: options?.newBackgroundFile,
            brightness: draft.background.brightness,
          },
        };

        const result = await updateDraft(updateInfo);
        if (result.ok) {
          setDraft(new Draft(result.payload));
          if (!options?.quite) {
            snakbar.show("Изменения сохранены", "success");
          }
        } else {
          snakbar.show("Ошибка при сохранении изменений", "error");
          console.error(result.error);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [draft]
    );

    useHotkeys("ctrl+s", () => update(), [update]);

    React.useEffect(() => {
      const loadDraft = async () => {
        const result = await getDraft(draftId);
        if (result.ok) {
          setDraft(new Draft(result.payload));
        } else {
          snakbar.show("Ошибка при загрузке черновика", "error");
          console.error(result.error);
        }
      };

      loadDraft();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draftId]);

    if (!draft) {
      return null;
    }

    return (
      <EditorContext.Provider
        value={{
          draft,
          updateDraft: update,
          audioPlayer,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 5,
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                onClick={() => {
                  openDraftDir(draft.id);
                }}
              >
                <FolderIcon fontSize="large" />
              </IconButton>
              <Typography variant="h4">
                {truncateString(draft.name, 20)}
              </Typography>
            </Box>
            <Tabs
              value={curTab}
              onChange={(_: any, newTab: number) => setCurTab(newTab)}
            >
              <EditorTab label="Поле" />
              <EditorTab label="Текст" />
              <EditorTab label="Дизайн" />
              <EditorTab label="Настройки" />
            </Tabs>
            <BackButton
              sx={{ p: 2 }}
              color="success"
              label="Сохранить и выйти"
              href={RoutePath.levelDraftList}
              onBack={() => update({ quite: true })}
            />
          </Box>

          <EditorTabPanel sx={{ mt: 0 }} value={curTab} index={0}>
            <FieldEditor />
          </EditorTabPanel>
          <EditorTabPanel value={curTab} index={1}>
            <TextEditor />
          </EditorTabPanel>
          <EditorTabPanel value={curTab} index={2}>
            <StyleEditor />
          </EditorTabPanel>
          <EditorTabPanel value={curTab} index={3}>
            <Settings />
          </EditorTabPanel>
        </Box>
      </EditorContext.Provider>
    );
  }
);
