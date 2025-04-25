import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Typography,
  Box,
  Paper,
  Avatar,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import BlockIcon from "@mui/icons-material/Block";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { UserApi } from "@/api/userApi";
import { RoutePath } from "@/config/routes/path";
import { PlayerStats, UserInfo } from "@/api/models";

const transformErrorData = (
  errorData: Record<string, Record<string, number[]>>
) => {
  const result: Array<{ char: string; errors: number; language: string }> = [];

  for (const [language, chars] of Object.entries(errorData)) {
    const langCode = language;
    for (const [char, [all, error]] of Object.entries(chars)) {
      if (error > 0) {
        result.push({
          char: `${String.fromCharCode(parseInt(char))}`,
          errors: (error / all) * 100,
          language: langCode,
        });
      }
    }
  }

  return result;
};

const StatChip = ({
  label,
  value,
}: {
  label: string;
  value?: number | string;
}) =>
  value !== undefined && value !== null ? (
    <Chip label={`${label}: ${value}`} variant="outlined" sx={{ m: 0.5 }} />
  ) : null;

export const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<UserInfo>();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"rus" | "eng">(
    "eng"
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await UserApi.getUserInfo();

        setProfile(userData);

        try {
          const statsData = await UserApi.getUserStats(userData.id);
          console.log(statsData);
          setStats(statsData);
          console.log(stats);
        } catch (statsError) {
          console.error("Stats fetch error:", statsError);
          setError("Не удалось загрузить статистику");
        }
      } catch (userError) {
        console.error("Profile fetch error:", userError);
        setError("Ошибка загрузки профиля");
        navigate(RoutePath.login);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      navigate(RoutePath.login);
      return;
    }

    fetchProfile();
  }, [navigate]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Пожалуйста, выберите файл изображения");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");
      await UserApi.changeAvatar(file);

      // Обновляем данные профиля после успешной загрузки
      const updatedProfile = await UserApi.getUserInfo();
      setProfile(updatedProfile);
    } catch (err) {
      console.error("Avatar upload error:", err);
      setUploadError("Ошибка загрузки аватара");
    } finally {
      setUploading(false);
      event.target.value = ""; // Сброс значения input
    }
  };

  const errorChartData = stats?.num_press_err_by_char_by_lang
    ? transformErrorData(stats?.num_press_err_by_char_by_lang)
    : [];

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!profile) {
    return (
      <Typography variant="h5" textAlign="center" mt={4}>
        Профиль не найден
      </Typography>
    );
  }

  const { username, access, ban_reason, ban_time, id, avatar_path } = profile;
  if (avatar_path.Valid) {
    console.log(avatar_path.String);
  }
  console.log(avatar_path);
  const backend_url =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  console.log(backend_url);
  const classes = new Map<number, string>([
    [0, "S"],
    [1, "A"],
    [2, "B"],
    [3, "C"],
    [4, "D"],
  ]);
  console.log(classes);
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
            Профиль пользователя
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ position: "relative" }}>
              <IconButton
                onClick={handleAvatarClick}
                sx={{ p: 0, "&:hover": { opacity: 0.8 } }}
                disabled={uploading}
              >
                <Avatar
                  src={
                    avatar_path.Valid
                      ? `${backend_url}/${avatar_path.String}`
                      : undefined
                  }
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: "2.5rem",
                    bgcolor: avatar_path.Valid ? "transparent" : "primary.main",
                  }}
                >
                  {!avatar_path.Valid && (
                    <PersonIcon
                      sx={{
                        fontSize: 48,
                        color: "white",
                        width: "60%",
                        height: "60%",
                      }}
                    />
                  )}
                </Avatar>
                {uploading && (
                  <CircularProgress
                    size={68}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-34px",
                      marginLeft: "-34px",
                    }}
                  />
                )}
              </IconButton>
              <CameraAltIcon
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "primary.main",
                  color: "white",
                  p: 0.5,
                  borderRadius: "50%",
                  fontSize: "1.5rem",
                }}
              />
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </Box>

            <Stack spacing={1}>
              <Typography variant="h5">{username}</Typography>
              <Chip
                label={`ID: ${id}`}
                variant="outlined"
                size="small"
                sx={{ alignSelf: "flex-start" }}
              />
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              <SecurityIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Уровень доступа:
            </Typography>
            <Chip
              label={getAccessLevelLabel(access)}
              color={access >= 2 ? "secondary" : "default"}
              sx={{ mt: 1 }}
            />
            <br></br>
            {access >= 2 && (
              <Button
                component={Link}
                to={RoutePath.admin}
                variant="outlined"
                startIcon={<AdminPanelSettingsIcon />}
                sx={{ mt: 2 }}
              >
                Административная панель
              </Button>
            )}
          </Box>

          {ban_reason && ban_reason !== "no ban" && (
            <Box sx={{ backgroundColor: "#ffeeee", p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" color="error">
                <BlockIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Пользователь заблокирован
              </Typography>
              <Typography>Причина: {ban_reason}</Typography>
              {ban_time && (
                <Typography>
                  Время блокировки: {new Date(ban_time).toLocaleString()}
                </Typography>
              )}
            </Box>
          )}

          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              <EqualizerIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Игровая статистика:
            </Typography>

            {!stats ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Статистика недоступна
              </Typography>
            ) : (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2">
                    Основные показатели:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                    <StatChip label="Общие очки" value={stats.sum_points} />
                    <StatChip
                      label="Уровней пройдено"
                      value={stats.num_level_classic}
                    />
                    <StatChip
                      label="Символов напечатано"
                      value={stats.num_chars_classic}
                    />
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2">
                    Показатели аккуратности:
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                    <StatChip
                      label="Средняя точность"
                      value={stats.average_accuracy_classic?.toFixed(3)}
                    />
                    {stats.average_delay !== undefined &&
                      stats.average_delay !== 1000 && (
                        <StatChip
                          label="Средняя задержка"
                          value={`${stats.average_delay.toFixed(3)} мс`}
                        />
                      )}
                  </Stack>
                </Box>

                {stats.num_classes_classic?.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2">
                      Пройденные уровни по классам точности:
                    </Typography>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      gap={1}
                      sx={{ mt: 1 }}
                    >
                      {stats.num_classes_classic.map((cls, index) => (
                        <Chip
                          key={index}
                          label={`Класс ${classes.get(index)}: ${cls}`}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                {errorChartData.length > 0 ? (
                  <Box sx={{ mt: 4, height: 400 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        Ошибки по символам
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label="Русский"
                          onClick={() => setSelectedLanguage("rus")}
                          color={
                            selectedLanguage === "rus" ? "primary" : "default"
                          }
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          label="Английский"
                          onClick={() => setSelectedLanguage("eng")}
                          color={
                            selectedLanguage === "eng" ? "primary" : "default"
                          }
                          variant="outlined"
                          size="small"
                        />
                      </Stack>
                    </Box>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={errorChartData.filter(
                          (d) => d.language === selectedLanguage
                        )}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="char" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="errors"
                          fill="#ff6666"
                          name="Процент ошибок"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Нет данных об ошибках
                  </Typography>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

const getAccessLevelLabel = (access: number) => {
  switch (access) {
    case 0:
      return "Забанен";
    case 1:
      return "Пользователь";
    case 2:
      return "Модератор";
    case 3:
      return "Администратор";
    case 4:
      return "Главный администратор";
    default:
      return "Гость";
  }
};
