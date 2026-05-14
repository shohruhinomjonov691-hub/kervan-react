import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { NavLink } from "react-router-dom";
import TelegramService from "../../services/TelegramService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.75rem",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: "0.9375rem",
    background: "#faf7f4",
    "& fieldset": { borderColor: "#dbc2b0" },
    "&:hover fieldset": { borderColor: "#8d4b00" },
    "&.Mui-focused fieldset": { borderColor: "#8d4b00", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: "0.875rem",
    color: "#887364",
    "&.Mui-focused": { color: "#8d4b00" },
  },
};

export default function Hero() {
  const [bookOpen, setBookOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    branch: "Itaewon",
    date: "",
    time: "",
    guests: "2",
  });

  const handleChange = (field: string) => (e: T) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.phone || !form.date || !form.time)
        throw new Error("Please fill in all required fields.");
      setLoading(true);
      const telegram = new TelegramService();
      await telegram.sendBooking({
        name: form.name,
        phone: form.phone,
        branch: form.branch,
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
      });
      await sweetTopSmallSuccessAlert(
        "Reservation sent! We'll contact you shortly 🌙",
        2000,
      );
      setBookOpen(false);
      setForm({
        name: "",
        phone: "",
        branch: "Itaewon",
        date: "",
        time: "",
        guests: "2",
      });
    } catch (err) {
      setBookOpen(false);
      setForm({
        name: "",
        phone: "",
        branch: "Itaewon",
        date: "",
        time: "",
        guests: "2",
      });
      sweetErrorHandling(err).then();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <div className="hero-section">
        <div className="hero-overlay" />
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 2, pt: "120px", pb: "80px" }}
        >
          <Stack alignItems="flex-start" sx={{ maxWidth: 560 }}>
            <Box className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              Since 2005
            </Box>
            <Typography className="hero-headline" component="h1">
              Experience the
              <br />
              <em>Silk Road</em> in Seoul
            </Typography>
            <Typography className="hero-sub">
              Indulge in authentic Turkish hospitality and a culinary journey
              that spans centuries. From the bustling streets of Istanbul to the
              heart of Seoul.
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
              <Button
                variant="contained"
                className="hero-btn-primary"
                onClick={() => setBookOpen(true)}
              >
                Book a Table
              </Button>
              <Button
                variant="outlined"
                className="hero-btn-ghost"
                component={NavLink as any}
                to="/products"
              >
                View Menu
              </Button>
            </Stack>
          </Stack>
        </Container>
      </div>

      {/* ── BOOK A TABLE MODAL ── */}
      <Dialog
        open={bookOpen}
        onClose={() => setBookOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "1.25rem",
            boxShadow: "0 24px 64px rgba(141,75,0,0.14)",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 4,
            pt: 4,
            pb: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Noto Serif',serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#8d4b00",
                mb: 0.5,
              }}
            >
              Kervan
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Noto Serif',serif",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#1c1b1b",
              }}
            >
              Reserve a Table
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Be Vietnam Pro',sans-serif",
                fontSize: "0.875rem",
                color: "#887364",
                mt: 0.5,
              }}
            >
              We'll confirm your reservation within 30 minutes.
            </Typography>
          </Box>
          <IconButton
            onClick={() => setBookOpen(false)}
            size="small"
            sx={{
              color: "#887364",
              border: "1px solid rgba(219,194,176,0.4)",
              borderRadius: "0.5rem",
              mt: 0.5,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 3, pb: 4 }}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Full Name *"
                value={form.name}
                onChange={handleChange("name")}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon
                        sx={{ color: "#8d4b00", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Phone *"
                value={form.phone}
                onChange={handleChange("phone")}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon
                        sx={{ color: "#8d4b00", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <TextField
              fullWidth
              select
              label="Branch"
              value={form.branch}
              onChange={handleChange("branch")}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlinedIcon
                      sx={{ color: "#8d4b00", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="Itaewon">Itaewon Flagship</MenuItem>
              <MenuItem value="COEX">COEX Mall Terminal</MenuItem>
              <MenuItem value="Famille Station">Famille Station</MenuItem>
            </TextField>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Date *"
                type="date"
                value={form.date}
                onChange={handleChange("date")}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayOutlinedIcon
                        sx={{ color: "#8d4b00", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Time *"
                type="time"
                value={form.time}
                onChange={handleChange("time")}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeOutlinedIcon
                        sx={{ color: "#8d4b00", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            <TextField
              fullWidth
              select
              label="Number of Guests"
              value={form.guests}
              onChange={handleChange("guests")}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PeopleOutlineIcon
                      sx={{ color: "#8d4b00", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
            >
              {["1", "2", "3", "4", "5", "6", "7", "8+"].map((n) => (
                <MenuItem key={n} value={n}>
                  {n} {n === "1" ? "Guest" : "Guests"}
                </MenuItem>
              ))}
            </TextField>
            <Divider sx={{ borderColor: "rgba(219,194,176,0.3)" }} />
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                height: 52,
                borderRadius: "999px",
                background: "#8d4b00",
                fontFamily: "'Be Vietnam Pro',sans-serif",
                fontWeight: 600,
                fontSize: "0.9375rem",
                textTransform: "none",
                boxShadow: "0 4px 16px rgba(141,75,0,0.22)",
                "&:hover": { background: "#6e3900" },
                "&.Mui-disabled": { background: "#dbc2b0", color: "#fff" },
              }}
            >
              {loading ? "Sending..." : "Confirm Reservation"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
