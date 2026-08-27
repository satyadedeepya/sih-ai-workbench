/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Design tokens ----
        // Subject: an industrial control-room / SCADA panel, not a chat app.
        base: {
          bg: "#0A0E13",      // main background, near-black blue-slate
          panel: "#11161D",   // raised panel surface
          panel2: "#161C24",  // slightly lighter panel (nested surfaces)
          border: "#232B34",  // hairline borders / dividers
        },
        text: {
          primary: "#EDF1F5",
          secondary: "#8B96A3",
          tertiary: "#586170",
        },
        amber: {
          DEFAULT: "#F0A020", // primary accent — instrumentation amber
          dim: "#8A5D18",
        },
        secure: {
          DEFAULT: "#35D399", // "air-gapped / local / secure" green
          dim: "#1C7A56",
        },
        alert: {
          DEFAULT: "#E2544B", // reserved for critical findings only
        },
        wire: {
          DEFAULT: "#3E9DD8", // cool signal-blue for links/data flow
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(62,157,216,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(62,157,216,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.25 },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        blink: "blink 1.6s ease-in-out infinite",
        scan: "scan 3s linear infinite",
      },
    },
  },
  plugins: [],
};
