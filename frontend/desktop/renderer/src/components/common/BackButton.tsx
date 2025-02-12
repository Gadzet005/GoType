import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, ButtonProps } from "@/components/ui/Button";
import { useNavigate } from "@/core/hooks";
import { useHotkeys } from "react-hotkeys-hook";

interface BackButtonProps extends ButtonProps {
  href: string;
  params?: object;
}

export const BackButton: React.FC<BackButtonProps> = ({
  variant = "contained",
  startIcon = <ArrowBackIcon />,
  color = "error",
  children = "Назад",
  ...other
}) => {
  const navigate = useNavigate();
  useHotkeys("esc", () => navigate(other.href, other.params));

  return (
    <Button
      sx={{ py: 2, px: 4, fontSize: "1rem", fontWeight: 500 }}
      variant={variant}
      startIcon={startIcon}
      color={color}
      {...other}
    >
      {children}
    </Button>
  );
};
