import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { DraftInfo } from "@desktop-common/draft";
import { Box, Tabs, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { EditorContext } from "./context";
import { Draft } from "./draft";
import { FieldEditor } from "./panels/FieldEditor";
import { Settings } from "./panels/Settings";
import { TextEditor } from "./panels/TextEditor";
import { EditorTabPanel } from "./utils/EditorTabPanel";
import { truncateString } from "@/core/utils/string";
import { EditorTab } from "./utils/EditorTab";
import { StyleEditor } from "./panels/StyleEditor";

interface LevelEditorPageProps {
  draftData: DraftInfo;
  initialTab?: number;
}

export const LevelEditorPage: React.FC<LevelEditorPageProps> = observer(
  ({ draftData, initialTab = 0 }) => {
    const [curTab, setCurTab] = React.useState(initialTab);
    const draft = React.useMemo(() => new Draft(draftData), [draftData]);

    return (
      <EditorContext.Provider value={draft}>
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
