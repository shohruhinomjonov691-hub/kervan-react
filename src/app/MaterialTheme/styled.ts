import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import { Box } from "@mui/material";

export const StyledBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#ffffff",
  borderRadius: "999px",
  padding: "2px 10px",
  fontSize: "0.75rem",
  fontWeight: 600,
}));

export const RippleBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    color: "#44b700",
    background: "white",
    "&::after": {
      position: "absolute",
      top: "-2px",
      left: "-2px",
      width: "120%",
      height: "120%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "2px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
