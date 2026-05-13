import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
  setSignupOpen: (v: boolean) => void;
  setLoginOpen: (v: boolean) => void;
}

/* ── Shared input sx ── */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.625rem",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: "0.9375rem",
    background: "#faf7f4",
    "& fieldset": { borderColor: "#e8d9cc" },
    "&:hover fieldset": { borderColor: "#8d4b00" },
    "&.Mui-focused fieldset": { borderColor: "#8d4b00", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: "0.875rem",
    color: "#a08070",
    "&.Mui-focused": { color: "#8d4b00" },
  },
};

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const {
    signupOpen,
    loginOpen,
    handleSignupClose,
    handleLoginClose,
    setSignupOpen,
    setLoginOpen,
  } = props;
  const { setAuthMember } = useGlobals();

  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");

  const handleUserName = (e: T) => setMemberNick(e.target.value);
  const handlePhone = (e: T) => setMemberPhone(e.target.value);
  const handlePassword = (e: T) => setMemberPassword(e.target.value);

  const handleKeyDown = (e: T) => {
    if (e.key === "Enter") {
      loginOpen ? handleLoginRequest() : handleSignupRequest();
    }
  };

  const handleLoginRequest = async () => {
    try {
      if (!memberNick || !memberPassword) throw new Error(Messages.error3);
      const result = await new MemberService().login({
        memberNick,
        memberPassword,
      } as LoginInput);
      setAuthMember(result);
      await sweetTopSmallSuccessAlert("Welcome back! 🎉", 1200);
      handleLoginClose();
      setMemberNick("");
      setMemberPassword("");
    } catch (err) {
      console.log(err);
      handleLoginClose();
      setMemberNick("");
      setMemberPassword("");
      sweetErrorHandling(err).then();
    }
  };

  const handleSignupRequest = async () => {
    try {
      if (!memberNick || !memberPhone || !memberPassword)
        throw new Error(Messages.error3);
      const input: MemberInput = { memberNick, memberPhone, memberPassword };
      const result = await new MemberService().signup(input);
      setAuthMember(result);
      await sweetTopSmallSuccessAlert("Welcome to Kervan! 🌙", 1400);
      handleSignupClose();
      setMemberNick("");
      setMemberPhone("");
      setMemberPassword("");
    } catch (err) {
      console.log(err);
      handleLoginClose();
      setMemberNick("");
      setMemberPhone("");
      setMemberPassword("");
      sweetErrorHandling(err).then();
    }
  };

  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "96%", sm: 780 },
    bgcolor: "#fff",
    borderRadius: "1.5rem",
    boxShadow:
      "0 32px 80px rgba(141,75,0,0.16), 0 0 0 1px rgba(219,194,176,0.2)",
    outline: "none",
    overflow: "hidden",
    display: "flex",
    flexDirection: "row" as const,
    minHeight: 500,
  };

  /* ── Shared left panel ── */
  const LeftPanel = ({ title }: { title: string }) => (
    <Box
      sx={{
        width: { xs: 0, sm: "44%" },
        display: { xs: "none", sm: "flex" },
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        overflow: "hidden",
        backgroundImage: "url('/img/kervanImage.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: 500,
      }}
    >
      {/* Dark overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(20,10,0,0.2) 0%, rgba(20,10,0,0.75) 100%)",
        }}
      />

      {/* Content */}
      <Box sx={{ position: "relative", zIndex: 2, p: 4 }}>
        <Typography
          sx={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.75)",
            lineHeight: 1.6,
          }}
        >
          Authentic Turkish cuisine in the heart of Seoul.
        </Typography>
        {/* Brand */}
        <Typography
          sx={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#ffb77d",
            mt: 2,
          }}
        >
          Kervan ☽
        </Typography>
      </Box>
    </Box>
  );

  /* ── LOGIN ── */
  return (
    <>
      <Modal open={loginOpen} onClose={handleLoginClose}>
        <Box sx={modalStyle}>
          <LeftPanel title={"Welcome\nBack"} />

          {/* Right panel */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: { xs: 3, sm: 4.5 },
              justifyContent: "center",
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 3.5 }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8d4b00",
                    mb: 0.75,
                  }}
                >
                  Member Access
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "1.625rem",
                    fontWeight: 700,
                    color: "#1c1b1b",
                    lineHeight: 1.2,
                  }}
                >
                  Sign in to
                  <br />
                  your account
                </Typography>
              </Box>
              <IconButton
                onClick={handleLoginClose}
                size="small"
                sx={{
                  border: "1px solid #e8d9cc",
                  borderRadius: "0.5rem",
                  color: "#887364",
                  "&:hover": { borderColor: "#8d4b00", color: "#8d4b00" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* Fields */}
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Username"
                value={memberNick}
                onChange={handleUserName}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon
                        sx={{ color: "#c4956a", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handleKeyDown}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ color: "#c4956a", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Login button */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleLoginRequest}
                sx={{
                  height: 52,
                  borderRadius: "999px",
                  background:
                    "linear-gradient(135deg, #8d4b00 0%, #a85b00 100%)",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textTransform: "none",
                  letterSpacing: "0.02em",
                  boxShadow: "0 6px 20px rgba(141,75,0,0.28)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #6e3900 0%, #8d4b00 100%)",
                    boxShadow: "0 8px 24px rgba(141,75,0,0.36)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Sign In
              </Button>

              <Divider sx={{ borderColor: "rgba(219,194,176,0.35)" }}>
                <Typography
                  sx={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: "0.8125rem",
                    color: "#bba090",
                    px: 1,
                  }}
                >
                  or
                </Typography>
              </Divider>

              {/* Footer hint */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: "0.875rem",
                    color: "#887364",
                  }}
                >
                  New to Kervan?{" "}
                  <Box
                    component="span"
                    onClick={() => {
                      handleLoginClose();
                      setSignupOpen(true);
                    }}
                    sx={{
                      color: "#8d4b00",
                      fontWeight: 700,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Create account
                  </Box>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Modal>

      {/* ── SIGNUP ── */}
      <Modal open={signupOpen} onClose={handleSignupClose}>
        <Box sx={modalStyle}>
          <LeftPanel title={"Join the\nKervan Family"} />

          {/* Right panel */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: { xs: 3, sm: 4.5 },
              justifyContent: "center",
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 3.5 }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#8d4b00",
                    mb: 0.75,
                  }}
                >
                  New Member
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "1.625rem",
                    fontWeight: 700,
                    color: "#1c1b1b",
                    lineHeight: 1.2,
                  }}
                >
                  Create your
                  <br />
                  account
                </Typography>
              </Box>
              <IconButton
                onClick={handleSignupClose}
                size="small"
                sx={{
                  border: "1px solid #e8d9cc",
                  borderRadius: "0.5rem",
                  color: "#887364",
                  "&:hover": { borderColor: "#8d4b00", color: "#8d4b00" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* Fields */}
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Username"
                value={memberNick}
                onChange={handleUserName}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon
                        sx={{ color: "#c4956a", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Phone number"
                value={memberPhone}
                onChange={handlePhone}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon
                        sx={{ color: "#c4956a", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handleKeyDown}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ color: "#c4956a", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Signup button */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleSignupRequest}
                sx={{
                  height: 52,
                  borderRadius: "999px",
                  background:
                    "linear-gradient(135deg, #8d4b00 0%, #a85b00 100%)",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textTransform: "none",
                  letterSpacing: "0.02em",
                  boxShadow: "0 6px 20px rgba(141,75,0,0.28)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #6e3900 0%, #8d4b00 100%)",
                    boxShadow: "0 8px 24px rgba(141,75,0,0.36)",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                Create Account
              </Button>

              <Divider sx={{ borderColor: "rgba(219,194,176,0.35)" }}>
                <Typography
                  sx={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: "0.8125rem",
                    color: "#bba090",
                    px: 1,
                  }}
                >
                  or
                </Typography>
              </Divider>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: "0.875rem",
                    color: "#887364",
                  }}
                >
                  Already have an account?{" "}
                  <Box
                    component="span"
                    onClick={() => {
                      handleSignupClose();
                      setLoginOpen(true);
                    }}
                    sx={{
                      color: "#8d4b00",
                      fontWeight: 700,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign in
                  </Box>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
