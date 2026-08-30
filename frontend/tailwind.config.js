// // /** @type {import('tailwindcss').Config} */
// // export default {
// //   content: ["./index.html", "./src/**/*.{js,jsx}"],
// //   theme: {
// //     extend: {
// //       colors: {
// //         // ---- Design tokens -------------------------------------------------
// //         // Mood: premium enterprise AI assistant (Linear / Vercel / Claude
// //         // territory) — calm neutral surfaces, one confident accent, status
// //         // colors used sparingly and only where they mean something. No
// //         // "instrumentation" color, no terminal green-on-black default.
// //         base: {
// //           bg: "#0E0E12",        // app background
// //           panel: "#17171D",     // raised panel surface (cards, header, sidebar)
// //           panel2: "#1E1E25",    // nested surface (inputs, hovered rows)
// //           panel3: "#26262F",    // active/selected surface
// //           border: "#292933",    // default hairline border
// //           borderHi: "#37373F",  // emphasized border (hover/focus adjacent)
// //         },
// //         text: {
// //           primary: "#F4F4F6",
// //           secondary: "#A3A3AE",
// //           tertiary: "#68686F",
// //           disabled: "#45454D",
// //         },
// //         // Single confident accent for anything "active/selected/primary
// //         // action" — replaces the old instrumentation-amber.
// //         primary: {
// //           DEFAULT: "#7C6FEB",
// //           soft: "#211E38",
// //         },
// //         // Secondary accent for links/info — cooler and quieter than primary.
// //         info: {
// //           DEFAULT: "#5B8DEF",
// //           soft: "#1B2436",
// //         },
// //         secure: {
// //           DEFAULT: "#34C795",
// //           soft: "#152C22",
// //         },
// //         alert: {
// //           DEFAULT: "#F0645C",
// //           soft: "#33201F",
// //         },
// //         warn: {
// //           DEFAULT: "#E3B341",
// //           soft: "#33291A",
// //         },
// //       },
// //       fontFamily: {
// //         // Sans is now the voice of the whole product, including labels.
// //         // Mono is reserved for genuinely technical content: code, the
// //         // system log, and numeric telemetry — not headings or nav.
// //         sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
// //         mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
// //       },
// //       fontSize: {
// //         "2xs": ["0.6875rem", { lineHeight: "1rem" }],
// //         "3xs": ["0.625rem", { lineHeight: "0.875rem" }],
// //       },
// //       borderRadius: {
// //         xl: "0.75rem",
// //         "2xl": "1rem",
// //       },
// //       boxShadow: {
// //         panel: "0 1px 2px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02) inset",
// //         elevated: "0 10px 28px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
// //         focus: "0 0 0 3px rgba(124,111,235,0.25)",
// //       },
// //       keyframes: {
// //         blink: {
// //           "0%, 100%": { opacity: 1 },
// //           "50%": { opacity: 0.25 },
// //         },
// //         "fade-up": {
// //           "0%": { opacity: 0, transform: "translateY(4px)" },
// //           "100%": { opacity: 1, transform: "translateY(0)" },
// //         },
// //         "fade-in": {
// //           "0%": { opacity: 0 },
// //           "100%": { opacity: 1 },
// //         },
// //       },
// //       animation: {
// //         blink: "blink 1.8s ease-in-out infinite",
// //         "fade-up": "fade-up 220ms cubic-bezier(0.16,1,0.3,1) both",
// //         "fade-in": "fade-in 200ms ease-out both",
// //       },
// //       transitionDuration: {
// //         250: "250ms",
// //       },
// //     },
// //   },
// //   plugins: [],
// // };



// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       colors: {
//         // ---- Design tokens -------------------------------------------------
//         // Mood: premium enterprise AI assistant (Linear / Vercel / Claude
//         // territory) — calm neutral surfaces, one confident accent, status
//         // colors used sparingly and only where they mean something. No
//         // "instrumentation" color, no terminal green-on-black default.
//         base: {
//           bg: "#0E0E12",        // app background
//           panel: "#17171D",     // raised panel surface (cards, header, sidebar)
//           panel2: "#1E1E25",    // nested surface (inputs, hovered rows)
//           panel3: "#26262F",    // active/selected surface
//           border: "#292933",    // default hairline border
//           borderHi: "#37373F",  // emphasized border (hover/focus adjacent)
//         },
//         text: {
//           primary: "#F4F4F6",
//           secondary: "#A3A3AE",
//           tertiary: "#68686F",
//           disabled: "#45454D",
//         },
//         // Single confident accent for anything "active/selected/primary
//         // action" — replaces the old instrumentation-amber.
//         primary: {
//           DEFAULT: "#7C6FEB",
//           soft: "#211E38",
//         },
//         // Secondary accent for links/info — cooler and quieter than primary.
//         info: {
//           DEFAULT: "#5B8DEF",
//           soft: "#1B2436",
//         },
//         secure: {
//           DEFAULT: "#34C795",
//           soft: "#152C22",
//         },
//         alert: {
//           DEFAULT: "#F0645C",
//           soft: "#33201F",
//         },
//         warn: {
//           DEFAULT: "#E3B341",
//           soft: "#33291A",
//         },
//         // Industrial gold — used sparingly for MRPL/industrial identity
//         // accents (wordmark, a few highlight touches), never for status.
//         gold: {
//           DEFAULT: "#D4A857",
//           soft: "#332B18",
//         },
//       },
//       fontFamily: {
//         // Sans is now the voice of the whole product, including labels.
//         // Mono is reserved for genuinely technical content: code, the
//         // system log, and numeric telemetry — not headings or nav.
//         sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
//         mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
//       },
//       fontSize: {
//         "2xs": ["0.6875rem", { lineHeight: "1rem" }],
//         "3xs": ["0.625rem", { lineHeight: "0.875rem" }],
//       },
//       borderRadius: {
//         xl: "0.75rem",
//         "2xl": "1rem",
//       },
//       boxShadow: {
//         panel: "0 1px 2px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02) inset",
//         elevated: "0 10px 28px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
//         focus: "0 0 0 3px rgba(124,111,235,0.25)",
//       },
//       keyframes: {
//         blink: {
//           "0%, 100%": { opacity: 1 },
//           "50%": { opacity: 0.25 },
//         },
//         "fade-up": {
//           "0%": { opacity: 0, transform: "translateY(4px)" },
//           "100%": { opacity: 1, transform: "translateY(0)" },
//         },
//         "fade-in": {
//           "0%": { opacity: 0 },
//           "100%": { opacity: 1 },
//         },
//       },
//       animation: {
//         blink: "blink 1.8s ease-in-out infinite",
//         "fade-up": "fade-up 220ms cubic-bezier(0.16,1,0.3,1) both",
//         "fade-in": "fade-in 200ms ease-out both",
//       },
//       transitionDuration: {
//         250: "250ms",
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
        // Mood: premium enterprise AI assistant (Linear / Vercel / Claude
        // territory) — calm neutral surfaces, one confident accent, status
        // colors used sparingly and only where they mean something. No
        // "instrumentation" color, no terminal green-on-black default.
        base: {
          bg: "#0E0E12",        // app background
          panel: "#17171D",     // raised panel surface (cards, header, sidebar)
          panel2: "#1E1E25",    // nested surface (inputs, hovered rows)
          panel3: "#26262F",    // active/selected surface
          border: "#292933",    // default hairline border
          borderHi: "#37373F",  // emphasized border (hover/focus adjacent)
        },
        text: {
          primary: "#F4F4F6",
          secondary: "#A3A3AE",
          tertiary: "#68686F",
          disabled: "#45454D",
        },
        // ---- Monochrome violet system ---------------------------------
        // Every accent below is the SAME hue (~248°), differentiated only
        // by lightness/saturation. No competing hues anywhere in the UI.
        primary: {
          DEFAULT: "#7C6FEB", // core brand violet
          soft: "#211E38",
        },
        // Lighter tint of the same violet — used where "info" used to be.
        info: {
          DEFAULT: "#A79CF2",
          soft: "#221F3D",
        },
        // Slightly deeper/more saturated violet — used where "success" was.
        secure: {
          DEFAULT: "#6552D9",
          soft: "#1E1A38",
        },
        // Deepest, most saturated violet — used where "error" was, so it
        // still reads as "the serious one" via weight, not a new hue.
        alert: {
          DEFAULT: "#5241B8",
          soft: "#1D1936",
        },
        // Pale, low-saturation violet — used where "warning" was.
        warn: {
          DEFAULT: "#C7BFFB",
          soft: "#26233F",
        },
        // Former "industrial gold" identity accent — now a mid-tone violet
        // so the wordmark/highlights stay in the same family.
        gold: {
          DEFAULT: "#9284EE",
          soft: "#221E3D",
        },
      },
      fontFamily: {
        // Sans is now the voice of the whole product, including labels.
        // Mono is reserved for genuinely technical content: code, the
        // system log, and numeric telemetry — not headings or nav.
        sans: ["'Inter'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        "3xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
      boxShadow: {
        panel: "0 1px 2px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02) inset",
        elevated: "0 10px 28px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset",
        focus: "0 0 0 3px rgba(124,111,235,0.25)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.25 },
        },
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(4px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        blink: "blink 1.8s ease-in-out infinite",
        "fade-up": "fade-up 220ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 200ms ease-out both",
      },
      transitionDuration: {
        250: "250ms",
      },
    },
  },
  plugins: [],
};
