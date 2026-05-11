import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Faq } from "../../../lib/data/faq";
import { Terms } from "../../../lib/data/terms";
import TelegramService from "../../services/TelegramService";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";
import "../../../css/help.css";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.625rem",
    fontFamily: "'Be Vietnam Pro', sans-serif",
    background: "#fff",
    "& fieldset": { borderColor: "#e8d9cc" },
    "&:hover fieldset": { borderColor: "#8d4b00" },
    "&.Mui-focused fieldset": { borderColor: "#8d4b00", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    color: "#a08070",
    "&.Mui-focused": { color: "#8d4b00" },
  },
};

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const toggleFaq = (id: number) => setOpenFaq(openFaq === id ? null : id);

  const handleField = (field: string) => (e: T) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSend = async () => {
    try {
      if (!form.name || !form.email || !form.message)
        throw new Error("Please fill in all fields.");
      setSending(true);
      await new TelegramService().sendContact({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      await sweetTopSmallSuccessAlert(
        "Message sent! We'll reply within 2 hours. 📩",
        2000,
      );
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      sweetErrorHandling(err).then();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="help-page">
      {/* ── HERO ── */}
      <div className="help-hero">
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 2 }}>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography className="help-hero-title">
              How can we help?
            </Typography>
            <Typography className="help-hero-sub">
              Find answers to frequently asked questions about our Turkish
              culinary heritage, delivery services, and heritage locations in
              Seoul.
            </Typography>
          </Box>
        </Container>
      </div>

      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          gap={5}
          alignItems="flex-start"
        >
          {/* ── LEFT: FAQ + Terms ── */}
          <Box sx={{ flex: 1 }}>
            {/* FAQ */}
            <Box className="help-section-card">
              <Typography className="help-section-title">
                Frequently Asked Questions
              </Typography>

              <Stack gap={0} sx={{ mt: 2 }}>
                {Faq.map((item, i) => (
                  <Box key={item.id}>
                    <Box
                      className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}
                      onClick={() => toggleFaq(i)}
                    >
                      <Typography className="faq-question">
                        {item.question}
                      </Typography>
                      {openFaq === i ? (
                        <RemoveIcon
                          sx={{ fontSize: 18, color: "#8d4b00", flexShrink: 0 }}
                        />
                      ) : (
                        <AddIcon
                          sx={{ fontSize: 18, color: "#887364", flexShrink: 0 }}
                        />
                      )}
                    </Box>
                    {openFaq === i && (
                      <Box className="faq-answer">
                        <Typography className="faq-answer-text">
                          {item.answer}
                        </Typography>
                      </Box>
                    )}
                    {i < Faq.length - 1 && (
                      <Divider sx={{ borderColor: "rgba(219,194,176,0.3)" }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Terms & Policies */}
            <Box className="help-section-card" sx={{ mt: 3 }}>
              <Typography className="help-section-title">
                Terms & Policies
              </Typography>
              <Stack direction="row" gap={2} flexWrap="wrap" sx={{ mt: 2.5 }}>
                {Terms.slice(0, 4).map((term) => (
                  <Box key={term.id} className="terms-card">
                    <Typography className="terms-card-title">
                      {term.title.toUpperCase()}
                    </Typography>
                    <Typography className="terms-card-text">
                      {term.text.slice(0, 120)}...
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>

          {/* ── RIGHT: Contact form + Info ── */}
          <Box sx={{ width: { xs: "100%", lg: 380 }, flexShrink: 0 }}>
            {/* Send a message */}
            <Box className="help-section-card">
              <Typography className="help-section-title">
                Send a Message
              </Typography>
              <Typography className="help-contact-sub">
                Our hospitality team typically responds within 2 business hours.
              </Typography>

              <Stack gap={2.5} sx={{ mt: 2.5 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={form.name}
                  onChange={handleField("name")}
                  sx={inputSx}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  value={form.email}
                  onChange={handleField("email")}
                  sx={inputSx}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="How can we help?"
                  value={form.message}
                  onChange={handleField("message")}
                  sx={inputSx}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSend}
                  disabled={sending}
                  className="help-submit-btn"
                >
                  {sending ? "Sending..." : "Submit Inquiry"}
                </Button>
              </Stack>
            </Box>

            {/* Contact info */}
            <Box className="help-contact-card">
              <Typography className="help-contact-title">
                Contact Info
              </Typography>

              <Stack gap={2.5} sx={{ mt: 2 }}>
                <Stack direction="row" gap={2} alignItems="center">
                  <Box className="help-contact-icon">
                    <PhoneOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />
                  </Box>
                  <Box>
                    <Typography className="help-contact-label">
                      DIRECT LINE
                    </Typography>
                    <Typography className="help-contact-value">
                      +82 2 790 7077
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" gap={2} alignItems="center">
                  <Box className="help-contact-icon">
                    <EmailOutlinedIcon sx={{ fontSize: 18, color: "#fff" }} />
                  </Box>
                  <Box>
                    <Typography className="help-contact-label">
                      EMAIL INQUIRY
                    </Typography>
                    <Typography className="help-contact-value">
                      hospitality@kervan.co.kr
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />

                <Stack direction="row" gap={2} alignItems="flex-start">
                  <Box className="help-contact-icon">
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 18, color: "#fff" }}
                    />
                  </Box>
                  <Box>
                    <Typography className="help-contact-label">
                      MAIN BRANCHES
                    </Typography>
                    <Stack gap={1} sx={{ mt: 1 }}>
                      {[
                        {
                          name: "Itaewon",
                          addr: "127-3 Itaewon-ro, Yongsan-gu",
                        },
                        {
                          name: "COEX",
                          addr: "513 Yeongdong-daero, Gangnam-gu",
                        },
                      ].map((b) => (
                        <Box key={b.name} className="help-branch-item">
                          <Typography className="help-branch-name">
                            {b.name}
                          </Typography>
                          <Typography className="help-branch-addr">
                            {b.addr}, Seoul
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>

        {/* ── FULL WIDTH BANNER ── */}
        <Box className="help-banner">
          <Box className="help-banner-overlay" />
          <Box className="help-banner-content">
            <Typography className="help-banner-title">
              Experience authentic hospitality.
            </Typography>
            <Typography className="help-banner-sub">
              Whether it's a casual lunch or a grand celebration, our team is
              here to ensure your journey to Turkey starts at our table with
              warmth and grace.
            </Typography>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
