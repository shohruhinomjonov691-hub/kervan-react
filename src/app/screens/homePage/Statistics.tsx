import React from "react";
import { Box, Container, Stack } from "@mui/material";
import CountUp from "react-countup";

const stats = [
  { num: 3, suffix: "", label: "Branches" },
  { num: 50, suffix: "+", label: "Menu Items" },
  { num: 10000, suffix: "+", label: "Customers" },
  { num: 4.9, suffix: "", label: "Rating" },
];

export default function Statistics() {
  return (
    <div className="static-frame">
      <Container>
        <Stack className="info">
          {stats.map((stat, i) => (
            <Box key={i} className="static-box">
              <Box className="static-num">
                <CountUp
                  end={stat.num}
                  duration={2.5}
                  decimals={stat.num === 4.9 ? 1 : 0}
                  enableScrollSpy
                  scrollSpyOnce
                />
                {stat.suffix}
              </Box>
              <Box className="static-text">{stat.label}</Box>
            </Box>
          ))}
        </Stack>
      </Container>
    </div>
  );
}
