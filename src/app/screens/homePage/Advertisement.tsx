import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function Advertisement() {
  return (
    <>
      {/* ── SEASONAL SPECIAL ── */}
      <div className="seasonal-frame">
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            gap={6}
          >
            {/* Left image */}
            <Box className="seasonal-img-wrap">
              <img
                src="/img/seasonal-special.png"
                alt="Autumn Anatolian Feast"
                className="seasonal-img"
              />
            </Box>
            {/* Right content */}
            <Box className="seasonal-content">
              <Box className="section-label">Seasonal Special</Box>
              <Typography className="seasonal-title">
                The Autumn Anatolian Feast
              </Typography>
              <Typography className="seasonal-desc">
                Every season, our head chef Güzel catches autumn vibes that pay
                homage to the harvest spirit of Anatolia. This month, experience
                our slow-roasted lamb shank infused with mountain thyme and
                pomegranate molasses.
              </Typography>
              <Stack gap={1.2} sx={{ mb: 3 }}>
                {[
                  "Locally sourced organic vegetables",
                  "Authentic spices imported from Gaziantep",
                  "Limited availability daily",
                ].map((item) => (
                  <Stack key={item} direction="row" alignItems="center" gap={1}>
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 18, color: "#8d4b00", flexShrink: 0 }}
                    />
                    <Typography className="seasonal-feature">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Button variant="contained" className="seasonal-btn">
                Discover the Special
              </Button>
            </Box>
          </Stack>
        </Container>
      </div>

      {/* ── CRAFT / VIDEO SECTION ── */}
      <div className="craft-frame">
        <img
          src="/img/KervanVImage.jpeg"
          alt="Turkish Kitchen"
          className="craft-bg"
        />
        <div className="craft-overlay" />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box className="craft-content">
            <Typography className="craft-title">
              The Craft of Turkish Dining
            </Typography>
            <Typography className="craft-sub">
              Take a 2-minute journey into our kitchen and see how we bring the
              heritage of Turkey to Seoul.
            </Typography>
          </Box>
        </Container>
      </div>
    </>
  );
}
