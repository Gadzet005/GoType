import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { useAppContext, useNavigate, useSnackbar } from "@/core/hooks";
import { getAllDrafts } from "@/core/services/electron/draft/getAllDrafts";
import { DraftData } from "@desktop-common/draft";
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import { Box, Button, Container, Typography } from "@mui/material";
import React from "react";
import { DraftListItem } from "./item";
import { createDraft } from "@/core/services/electron/draft/createDraft";
import { removeDraft } from "@/core/services/electron/draft/removeDraft";

export const LevelDraftListPage = () => {
  const snackbar = useSnackbar();
  const ctx = useAppContext();
  const navigate = useNavigate();

  const [drafts, setDrafts] = React.useState<DraftData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadDrafts = async () => {
      const result = await getAllDrafts();
      if (result.ok) {
        setDrafts(result.payload);
      } else {
        snackbar.show("Ошибка при загрузке черновиков", "error");
        console.error(result.error);
      }
    };

    loadDrafts().then(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx]);

  const createNewDraft = React.useCallback(async () => {
    const result = await createDraft();
    if (result.ok) {
      navigate(RoutePath.levelEditor, { draftId: result.payload.id });
    } else {
      snackbar.show("Ошибка при создании нового черновика", "error");
      console.error(result.error);
    }
  }, [navigate, snackbar]);

  const deleteDraft = React.useCallback(
    async (draftId: number) => {
      const result = await removeDraft(draftId);
      if (result.ok) {
        setDrafts((list) => list.filter((draft) => draft.id !== draftId));
      } else {
        snackbar.show("Ошибка при удалении черновика", "error");
        console.error(result.error);
      }
    },
    [snackbar]
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
          <Typography sx={{ textTransform: "none" }} variant="h6">
            Создать уровень
          </Typography>
        </Button>
        <Container
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}
          maxWidth="md"
        >
          {!isLoading && list.length === 0 ? onListEmpty : list}
        </Container>
      </Box>
    </Box>
  );
};
