import { Box, Typography } from "@mui/material";
import { Button } from "@/components/ui/Button";
import { BackButton } from "@/components/common/BackButton";
import { RoutePath } from "@/core/config/routes/path";
import { LevelInfo } from "@desktop-common/level";
import { saveLevel } from "@/core/services/electron/level/saveLevel";

const level: LevelInfo = {
  id: 3,
  name: "Walk on Water",
  description:
    "«Walk on Water» — первый сингл группы 30 Seconds to Mars из пятого студийного альбома группы America. Песня была написана солистом группы Джаредом Лето. Сингл вышел в продажу 22 августа 2017 года.",
  author: {
    id: 1,
    name: "John Doe",
  },
  duration: 3000,
  preview: {
    ext: "jpg",
    url: "",
  },
  tags: ["имба"],
  languageCode: "eng",

  audio: {
    ext: "mp3",
    url: "",
  },
  background: {
    asset: {
      ext: "jpg",
      url: "",
    },
    brightness: 0.3,
  },
  sentences: [
    {
      content: "Can you even see what you're fighting for?",
      showTime: 0,
      duration: 1000,
      style: {
        bgcolor: "lightgrey",
        padding: 1,
        borderRadius: 4,
        animations: {
          intro: { duration: 50 },
          outro: { duration: 50 },
        },
        letter: {
          default: {
            fontFamily: "Roboto",
            fontSize: 50,
            fontWeight: "bold",
            color: "black",
          },
          active: {
            color: "blue",
            fontSize: 60,
          },
          mistake: {
            color: "red",
          },
          success: {
            color: "green",
          },
        },
      },
      coord: { x: 5, y: 5 },
    },
    {
      content: "Bloodlust and a holy war",
      showTime: 800,
      duration: 700,
      style: {
        bgcolor: "lightgrey",
        padding: 1,
        borderRadius: 4,
        rotate: 30,
        animations: {
          intro: { duration: 50 },
          outro: { duration: 50 },
        },
        letter: {
          default: {
            fontFamily: "Roboto",
            fontSize: 50,
            fontWeight: "bold",
            color: "black",
          },
          active: {
            color: "blue",
            fontSize: 60,
          },
          mistake: {
            color: "red",
          },
          success: {
            color: "green",
          },
        },
      },
      coord: { x: 50, y: 50 },
    },
    {
      content: "Listen up, hear the patriots shout",
      showTime: 1700,
      duration: 800,
      style: {
        bgcolor: "lightgrey",
        padding: 1,
        borderRadius: 4,
        animations: {
          intro: { duration: 50 },
          outro: { duration: 50 },
        },
        letter: {
          default: {
            fontFamily: "Roboto",
            fontSize: 70,
            fontWeight: "bold",
            color: "black",
          },
          active: {
            color: "blue",
            fontSize: 80,
          },
          mistake: {
            color: "red",
          },
          success: {
            color: "green",
          },
        },
      },
      coord: { x: 10, y: 90 },
    },
  ],
};

export const TestLevelEditorPage = () => {
  const handleCreateLevel = async () => {
    await saveLevel(level);
  };

  return (
    <Box sx={{ p: 2 }}>
      <BackButton href={RoutePath.home} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Редактор уровней</Typography>
        <Button
          sx={{
            textAlign: "center",
            mt: 5,
            width: "400px",
            fontSize: "1.25rem",
          }}
          variant="contained"
          onClick={handleCreateLevel}
        >
          Создать уровень
        </Button>
      </Box>
    </Box>
  );
};
