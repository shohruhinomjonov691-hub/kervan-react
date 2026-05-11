import React from "react";
import {
  Box,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import ShareIcon from "@mui/icons-material/Share";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../../../css/footer.css";

export default function Footer() {
  return (
    <Box component="footer" className="footer" sx={{ background: "#1c1b1b" }}>
      <Container maxWidth="lg">
        {/* ── TOP SECTION ── */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 5, md: 8 }}
          sx={{ py: 7 }}
        >
          {/* Brand column */}
          <Box sx={{ minWidth: 220 }}>
            <Typography className="footer-brand">Kervan</Typography>
            <Typography className="footer-brand-sub">
              Bringing the soul of Anatolian heritage to the heart of Seoul.
              Every dish tells a story of tradition.
            </Typography>
            {/* Social icons */}
            <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
              <IconButton className="footer-social-btn" size="small">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton className="footer-social-btn" size="small">
                <LanguageIcon fontSize="small" />
              </IconButton>
              <IconButton className="footer-social-btn" size="small">
                <ShareIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Nav columns */}
          <Stack
            direction="row"
            spacing={{ xs: 4, md: 8 }}
            flexWrap="wrap"
            sx={{ flex: 1 }}
          >
            {/* Navigation */}
            <Box>
              <Typography className="footer-col-title">Navigation</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {[
                  { label: "Our Story", to: "/help" },
                  { label: "The Menu", to: "/products" },
                  { label: "Reservations", to: "/" },
                  { label: "Locations", to: "/products" },
                ].map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.to}
                    className="footer-link"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </Stack>
            </Box>

            {/* Contact */}
            <Box>
              <Typography className="footer-col-title">Contact</Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Typography className="footer-contact-item">
                  📍 127-3 Itaewon-ro, Seoul
                </Typography>
                <Typography className="footer-contact-item">
                  📞 +82-2-792-4767
                </Typography>
                <Typography className="footer-contact-item">
                  ✉️ info@kervan.co.kr
                </Typography>
              </Stack>
            </Box>

            {/* Opening Hours */}
            <Box>
              <Typography className="footer-col-title">
                Opening Hours
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                <Box>
                  <Typography className="footer-hours-label">
                    Itaewon & Famille
                  </Typography>
                  <Typography className="footer-hours-value">
                    11:00 AM – 10:00 PM
                  </Typography>
                </Box>
                <Box>
                  <Typography className="footer-hours-label">
                    COEX Mall
                  </Typography>
                  <Typography className="footer-hours-value">
                    10:30 AM – 10:00 PM
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Newsletter */}
            <Box sx={{ minWidth: 220 }}>
              <Typography className="footer-col-title">Newsletter</Typography>
              <Typography className="footer-newsletter-sub">
                Join our circle for exclusive seasonal menus and cultural
                events.
              </Typography>
              <Stack
                direction="row"
                sx={{
                  mt: 2,
                  border: "1px solid rgba(219,194,176,0.5)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  className="footer-email-input"
                />
                <IconButton
                  size="small"
                  sx={{
                    m: 0.5,
                    background: "#8d4b00",
                    color: "#fff",
                    borderRadius: "999px",
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    "&:hover": { background: "#6e3900" },
                  }}
                >
                  <ArrowForwardIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: "rgba(219,194,176,0.35)" }} />

        {/* ── BOTTOM ROW ── */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
          sx={{ py: 3 }}
        >
          <Typography className="footer-copy">
            © 2025 Kervan Turkish Restaurant. Crafting Heritage &amp; Anatolian
            Cuisine Daily.
          </Typography>
          <Stack direction="row" spacing={3}>
            <NavLink to="/help" className="footer-bottom-link">
              Privacy Policy
            </NavLink>
            <NavLink to="/help" className="footer-bottom-link">
              Terms of Dining
            </NavLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
