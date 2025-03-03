import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { DraftData } from "@desktop-common/draft";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { observer } from "mobx-react";
import React from "react";
import { EditorContext } from "./context";
import { Draft } from "./draft";
import { FieldEditor } from "./panels/FieldEditor";
import { GeneralSettings } from "./panels/GeneralSettings";
import { TextEditor } from "./panels/TextEditor";
import { EditorTabPanel } from "./utils/EditorTabPanel";
import { truncateString } from "@/core/utils/string";

interface LevelEditorPageProps {
  draftData: DraftData;
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
              <Tab sx={{ fontSize: 25, textTransform: "none" }} label="Поле" />
              <Tab sx={{ fontSize: 25, textTransform: "none" }} label="Текст" />
              <Tab
                sx={{ fontSize: 25, textTransform: "none" }}
                label="Настройки"
              />
            </Tabs>
            <BackButton
              sx={{ p: 2 }}
              color="success"
              label="Сохранить и выйти"
              href={RoutePath.levelDraftList}
            />
          </Box>

          <EditorTabPanel sx={{ height: "100%" }} value={curTab} index={0}>
            <FieldEditor />
          </EditorTabPanel>
          <EditorTabPanel value={curTab} index={1}>
            <TextEditor />
          </EditorTabPanel>
          <EditorTabPanel value={curTab} index={2}>
            <GeneralSettings />
          </EditorTabPanel>
        </Box>
      </EditorContext.Provider>
    );
  }
);
