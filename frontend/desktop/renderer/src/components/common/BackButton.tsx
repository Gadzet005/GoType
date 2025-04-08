import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, ButtonProps } from "@/components/ui/Button";
import { useNavigate } from "@/core/hooks";
import { useHotkeys } from "react-hotkeys-hook";

interface BackButtonProps extends Omit<ButtonProps, "children"> {
  href: string;
  params?: Record<string, unknown>;
  label?: string;
  onBack?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  variant = "contained",
  startIcon = <ArrowBackIcon />,
  color = "error",
  label = "Назад",
  onBack = () => {},
  ...other
}) => {
  const navigate = useNavigate();
  useHotkeys("esc", () => {
    onBack();
    navigate(other.href, other.params);
  });

  return (
    <Button
      sx={{ py: 2, px: 4, fontSize: "1rem", fontWeight: 500 }}
      variant={variant}
      startIcon={startIcon}
      color={color}
      onClick={() => onBack()}
      {...other}
    >
      {label}
    </Button>
  );
};
