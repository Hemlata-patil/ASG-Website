/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--apex-border-dark)",
        input: "var(--apex-border-dark)",
        ring: "var(--apex-primary)",
        background: "var(--apex-bg-base)",
        foreground: "var(--apex-text-white)",
        primary: {
          DEFAULT: "var(--apex-primary)",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "var(--apex-bg-surface-elevated)",
          foreground: "var(--apex-text-white)",
        },
        destructive: {
          DEFAULT: "#ff3d00",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "var(--apex-bg-surface-elevated)",
          foreground: "var(--apex-text-muted)",
        },
        accent: {
          DEFAULT: "var(--apex-bg-surface-elevated)",
          foreground: "var(--apex-primary)",
        },
        popover: {
          DEFAULT: "var(--apex-bg-surface-elevated)",
          foreground: "var(--apex-text-white)",
        },
        card: {
          DEFAULT: "var(--apex-bg-surface)",
          foreground: "var(--apex-text-white)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
    },
  },
  plugins: [],
}
