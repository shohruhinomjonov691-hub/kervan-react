import React, { useState } from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const kervanEvents = [
  {
    id: 1,
    num: "01",
    tag: "LIVE MUSIC",
    tagColor: "#8d4b00",
    title: "Traditional Music Night",
    location: "Kervan Itaewon",
    date: "Every Friday",
    time: "7:00 PM",
    desc: "Enjoy live Oud and Bağlama performances as you dine under the warm glow of our Ottoman lanterns. Experience authentic Silk Road ambience.",
    img: "/img/tradition-music.png",
    cta: "Find Out More",
  },
  {
    id: 2,
    num: "02",
    tag: "BRUNCH",
    tagColor: "#895033",
    title: "The Grand Kahvaltı",
    location: "Kervan COEX",
    date: "Every Weekend",
    time: "10:00 AM",
    desc: "A lavish spread of simit, börek, cheeses, olives, and freshly brewed Turkish çay. The ultimate weekend morning ritual.",
    img: "/img/grand-kahvalti.png",
    cta: "Reserve a Table",
  },
  {
    id: 3,
    num: "03",
    tag: "BUSINESS",
    tagColor: "#5b5c59",
    title: "Executive Lunch Special",
    location: "Famille Station",
    date: "Mon – Fri",
    time: "12:00 PM",
    desc: "A curated 3-course menu for professional gatherings. Modern Anatolian cuisine served with panoramic city views of Seoul.",
    img: "/img/executed-lunch.png",
    cta: "Book Corporate",
  },
];

export default function Events() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="events-frame">
      <Container maxWidth="lg">
        {/* ── Header ── */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-end"
          sx={{ mb: 5 }}
        >
          <Box>
            <Box className="section-label">What's Happening</Box>
            <Typography
              sx={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "2.25rem",
                fontWeight: 700,
                color: "#1c1b1b",
                lineHeight: 1.2,
              }}
            >
              Upcoming Events
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: "0.875rem",
              color: "#887364",
              maxWidth: 260,
              textAlign: "right",
              lineHeight: 1.6,
            }}
          >
            Curated experiences across all three Kervan locations in Seoul.
          </Typography>
        </Stack>

        {/* ── 3-column grid ── */}
        <Stack direction={{ xs: "column", md: "row" }} gap={3}>
          {kervanEvents.map((event) => (
            <Box
              key={event.id}
              className="ev-card"
              onMouseEnter={() => setHovered(event.id)}
              onMouseLeave={() => setHovered(null)}
              sx={{
                flex: 1,
                background: "#fff",
                borderRadius: "1.25rem",
                overflow: "hidden",
                border: "1px solid rgba(219,194,176,0.35)",
                boxShadow:
                  hovered === event.id
                    ? "0 16px 40px rgba(141,75,0,0.14)"
                    : "0 2px 12px rgba(141,75,0,0.05)",
                transform:
                  hovered === event.id ? "translateY(-6px)" : "translateY(0)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Top accent bar */}
              <Box
                sx={{
                  height: 4,
                  background: event.tagColor,
                  flexShrink: 0,
                }}
              />

              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 220,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src={event.img}
                  alt={event.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.45s ease",
                    transform:
                      hovered === event.id ? "scale(1.07)" : "scale(1)",
                  }}
                  onError={(e: any) => {
                    e.target.src = "/img/homeNavbar.png";
                  }}
                />

                {/* Hover overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(20,10,0,0.55) 0%, rgba(20,10,0,0) 60%)",
                    opacity: hovered === event.id ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />

                {/* Number badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.25)",
                    lineHeight: 1,
                  }}
                >
                  {event.num}
                </Box>

                {/* Category tag */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: event.tagColor,
                    color: "#fff",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    padding: "4px 10px",
                    borderRadius: "999px",
                  }}
                >
                  {event.tag}
                </Box>
              </Box>

              {/* Body */}
              <Box
                sx={{
                  p: "20px 22px 24px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Title */}
                <Typography
                  sx={{
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#1c1b1b",
                    mb: 0.75,
                    lineHeight: 1.3,
                  }}
                >
                  {event.title}
                </Typography>

                {/* Location */}
                <Stack
                  direction="row"
                  alignItems="center"
                  gap={0.5}
                  sx={{ mb: 1.25 }}
                >
                  <LocationOnOutlinedIcon
                    sx={{ fontSize: 14, color: event.tagColor }}
                  />
                  <Typography
                    sx={{
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      fontSize: "0.8125rem",
                      color: event.tagColor,
                      fontWeight: 600,
                    }}
                  >
                    {event.location}
                  </Typography>
                </Stack>

                {/* Desc */}
                <Typography
                  sx={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: "0.875rem",
                    color: "#887364",
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {event.desc}
                </Typography>

                {/* Bottom row */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    mt: 2.5,
                    pt: 2,
                    borderTop: "1px solid rgba(219,194,176,0.3)",
                  }}
                >
                  {/* Date + Time */}
                  <Stack gap={0.5}>
                    <Stack direction="row" alignItems="center" gap={0.75}>
                      <CalendarTodayOutlinedIcon
                        sx={{ fontSize: 13, color: "#887364" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          fontSize: "0.8125rem",
                          color: "#554336",
                          fontWeight: 600,
                        }}
                      >
                        {event.date}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={0.75}>
                      <AccessTimeOutlinedIcon
                        sx={{ fontSize: 13, color: "#887364" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          fontSize: "0.8125rem",
                          color: "#887364",
                        }}
                      >
                        {event.time}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* CTA button */}
                  <Button
                    size="small"
                    endIcon={
                      <ArrowForwardIcon
                        sx={{
                          fontSize: "14px !important",
                          transition: "transform 0.2s",
                          transform:
                            hovered === event.id
                              ? "translateX(3px)"
                              : "translateX(0)",
                        }}
                      />
                    }
                    sx={{
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      fontSize: "0.8125rem",
                      fontWeight: 700,
                      textTransform: "none",
                      color: event.tagColor,
                      borderRadius: "999px",
                      border: `1px solid ${event.tagColor}`,
                      padding: "5px 14px",
                      "&:hover": {
                        background: event.tagColor,
                        color: "#fff",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {event.cta}
                  </Button>
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>
      </Container>
    </div>
  );
}
