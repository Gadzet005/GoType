import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { useAppContext, useNavigate } from "@/core/hooks";
import { getAllDrafts } from "@/core/services/electron/levelDraft/getAllDrafts";
import { LevelDraftInfo } from "@desktop-common/draft";
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { DraftListItem } from "./item";
import { createDraft } from "@/core/services/electron/levelDraft/createDraft";
import { removeDraft } from "@/core/services/electron/levelDraft/removeDraft";

export const LevelDraftListPage = () => {
  const ctx = useAppContext();
  const navigate = useNavigate();

  const [drafts, setDrafts] = React.useState<LevelDraftInfo[]>([]);

  React.useEffect(() => {
    const loadDrafts = async () => {
      const result = await ctx.runService(getAllDrafts);
      if (result.ok) {
        setDrafts(result.payload);
      } else {
        console.error("Failed to load drafts:", result.error);
      }
    };
    loadDrafts();
  }, [ctx]);

  const createNewDraft = async () => {
    const result = await ctx.runService(createDraft);
    if (result.ok) {
      navigate(RoutePath.levelEditor, { draft: result.payload });
    } else {
      console.error("Failed to create new draft:", result.error);
    }
  };

  const deleteDraft = React.useCallback(
    async (draftId: number) => {
      const result = await ctx.runService(removeDraft, draftId);
      if (result.ok) {
        setDrafts((list) => list.filter((draft) => draft.id !== draftId));
      } else {
        console.error("Failed to delete draft:", result.error);
      }
    },
    [ctx, setDrafts]
  );

  const list = React.useMemo(
    () =>
      drafts.map((draft) => {
        return (
          <DraftListItem
            key={draft.id}
            draft={draft}
            deleleSelf={() => deleteDraft(draft.id)}
          />
        );
      }),
    [drafts, deleteDraft]
  );

  const onListEmpty = (
    <Typography sx={{ textAlign: "center" }} variant="h4">
      Список черновиков пуст
    </Typography>
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
          onClick={createNewDraft}
        >
          <Typography variant="h6">Создать уровень</Typography>
        </Button>
        <Container
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}
          maxWidth="md"
        >
          {list.length === 0 ? onListEmpty : list}
        </Container>
      </Box>
    </Box>
  );
};
