// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       colors: {
//         // ---- Design tokens ----
//         // Subject: an industrial control-room / SCADA panel, not a chat app.
//         base: {
//           bg: "#0A0E13",      // main background, near-black blue-slate
//           panel: "#11161D",   // raised panel surface
//           panel2: "#161C24",  // slightly lighter panel (nested surfaces)
//           border: "#232B34",  // hairline borders / dividers
//         },
//         text: {
//           primary: "#EDF1F5",
//           secondary: "#8B96A3",
//           tertiary: "#586170",
//         },
//         amber: {
//           DEFAULT: "#F0A020", // primary accent — instrumentation amber
//           dim: "#8A5D18",
//         },
//         secure: {
//           DEFAULT: "#35D399", // "air-gapped / local / secure" green
//           dim: "#1C7A56",
//         },
//         alert: {
//           DEFAULT: "#E2544B", // reserved for critical findings only
//         },
//         wire: {
//           DEFAULT: "#3E9DD8", // cool signal-blue for links/data flow
//         },
//       },
//       fontFamily: {
//         mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
//         sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
//       },
//       backgroundImage: {
//         blueprint:
//           "linear-gradient(rgba(62,157,216,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(62,157,216,0.06) 1px, transparent 1px)",
//       },
//       backgroundSize: {
//         grid: "24px 24px",
//       },
//       keyframes: {
//         blink: {
//           "0%, 100%": { opacity: 1 },
//           "50%": { opacity: 0.25 },
//         },
//         scan: {
//           "0%": { transform: "translateY(-100%)" },
//           "100%": { transform: "translateY(100%)" },
//         },
//       },
//       animation: {
//         blink: "blink 1.6s ease-in-out infinite",
//         scan: "scan 3s linear infinite",
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Design tokens -------------------------------------------------
        // Subject: an industrial control-room panel re-imagined as premium
        // enterprise software (Linear/Vercel-grade execution), not a chat
        // toy and not a cyberpunk dashboard.
        base: {
          bg: "#0B0F14",       // app background
          panel: "#12171F",    // raised panel surface (cards, header, sidebar)
          panel2: "#181F29",   // nested surface (inputs, hovered rows)
          panel3: "#1E2732",   // active/selected surface
          border: "#232C37",   // default hairline border
          borderHi: "#303B48", // emphasized border (hover/focus adjacent)
        },
        text: {
          primary: "#EEF2F6",
          secondary: "#94A1B0",
          tertiary: "#5C6876",
          disabled: "#3D4653",
        },
        amber: {
          DEFAULT: "#E8A23B",
          soft: "#3A2E1A",
        },
        secure: {
          DEFAULT: "#33C98C",
          soft: "#173328",
        },
        alert: {
          DEFAULT: "#E5594F",
          soft: "#3A1F1D",
        },
        warn: {
          DEFAULT: "#E0B93E",
          soft: "#3A331A",
        },
        wire: {
          DEFAULT: "#4FA3DE",
          soft: "#1A2A38",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        "3xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        xl: "0.75rem",
      },
      boxShadow: {
        panel: "0 1px 2px 0 rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02) inset",
        elevated: "0 8px 24px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03) inset",
        focus: "0 0 0 3px rgba(79,163,222,0.25)",
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(79,163,222,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(79,163,222,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
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
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        blink: "blink 1.8s ease-in-out infinite",
        scan: "scan 3.5s linear infinite",
        "fade-up": "fade-up 220ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 200ms ease-out both",
        shimmer: "shimmer 1.8s linear infinite",
      },
      transitionDuration: {
        250: "250ms",
      },
    },
  },
  plugins: [],
};
