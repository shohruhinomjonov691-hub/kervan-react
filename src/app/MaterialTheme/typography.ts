// src/app/MaterialTheme/typography.ts
const typography = {
  fontFamily: "'Be Vietnam Pro', sans-serif",
  h1: {
    fontFamily: "'Noto Serif', serif",
    fontSize: "4.5rem",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontFamily: "'Noto Serif', serif",
    fontSize: "2.5rem",
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontFamily: "'Noto Serif', serif",
    fontSize: "1.75rem",
    fontWeight: 500,
    lineHeight: 1.3,
  },
  body1: {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.6,
  },
  body2: {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  button: {
    fontFamily: "'Be Vietnam Pro', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "none" as const,
  },
};

export default typography;
