import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { useAppContext } from "@/core/hooks";
import { getAllDrafts } from "@/core/services/electron/levelDraft/getAllDrafts";
import { LevelDraftInfo } from "@desktop-common/draft";
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { DraftListItem } from "./item";

export const LevelDraftListPage = () => {
  const ctx = useAppContext();

  const [drafts, setDrafts] = React.useState<LevelDraftInfo[]>([]);

  React.useEffect(() => {
    const loadDrafts = async () => {
      const result = await ctx.runService(getAllDrafts);
      if (result.ok) {
        setDrafts(result.payload!);
      }
    };
    loadDrafts();
  });

  const handleCreateDraft = () => {};

  const deleteDraft = React.useCallback(
    (draftId: number) => {
      setDrafts(drafts.filter((draft) => draft.id !== draftId));
    },
    [drafts]
  );

  const list = React.useMemo(
    () =>
      drafts.map((draft) => {
        return (
          <DraftListItem
            draft={draft}
            deleleSelf={() => deleteDraft(draft.id)}
          />
        );
      }),
    [drafts, deleteDraft]
  );

  const onListEmpty = (
    <Typography variant="h5">Список черновиков пуст</Typography>
  );

  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.home} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Typography variant="h3" color="primary">
          Черновики уровней
        </Typography>
        <Button
          sx={{ py: 1, px: 3 }}
          variant="contained"
          color="success"
          startIcon={<AddIcon fontSize="large" />}
          onClick={handleCreateDraft}
        >
          <Typography variant="h6">Создать уровень</Typography>
        </Button>
        <Box sx={{ display: "flex", gap: 3 }}>
          {list.length === 0 ? onListEmpty : list}
        </Box>
      </Box>
    </Box>
  );
};
