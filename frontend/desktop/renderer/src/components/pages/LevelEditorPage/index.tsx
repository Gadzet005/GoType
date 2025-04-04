import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { useSnackbar } from "@/core/hooks";
import { updateDraft } from "@/core/services/electron/levelDraft/updateDraft";
import { truncateString } from "@/core/utils/string";
import { DraftUpdate } from "@desktop-common/draft";
import { Box, Tabs, Typography } from "@mui/material";
import structuredClone from "@ungap/structured-clone";
import { observer } from "mobx-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { EditorContext } from "./context";
import { Draft } from "./store/draft";
import { FieldEditor } from "./panels/FieldEditor";
import { Settings } from "./panels/Settings";
import { StyleEditor } from "./panels/StyleEditor";
import { TextEditor } from "./panels/TextEditor";
import { EditorTab } from "./utils/EditorTab";
import { EditorTabPanel } from "./utils/EditorTabPanel";
import { getDraft } from "@/core/services/electron/levelDraft/getDraft";

interface LevelEditorPageProps {
  draftId: number;
  initialTab?: number;
}

export const LevelEditorPage: React.FC<LevelEditorPageProps> = observer(
  ({ draftId, initialTab = 0 }) => {
    const snakbar = useSnackbar();

    const [curTab, setCurTab] = React.useState(initialTab);
    const [draft, setDraft] = React.useState<Draft | null>(null);

    const update = React.useCallback(
      async (quite: boolean = false) => {
        if (!draft) {
          return;
        }

        const updateInfo: DraftUpdate.Args = {
          id: draft.id,
          name: draft.name,
          sentences: draft.sentences.map((s) => s.toDraftSentenceInfo()),
          styleClasses: structuredClone(draft.styleClasses.getAll(), {
            lossy: true,
          }),
        };

        const result = await updateDraft(updateInfo);
        if (result.ok) {
          setDraft(new Draft(result.payload));
          if (!quite) {
            snakbar.show("Изменения сохранены", "success");
          }
        } else {
          snakbar.show("Ошибка при сохранении изменений", "error");
        }
      },
      [draft, snakbar]
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
        }}
      >
        <Box sx={{ height: "100%" }}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              gap: 5,
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="h4">
              {truncateString(draft.name, 20)}
            </Typography>
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
              onBack={() => update(true)}
            />
          </Box>

          <EditorTabPanel value={curTab} index={0}>
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
