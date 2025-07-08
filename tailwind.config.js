/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- This line is critical
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          card: "var(--bg-card)",
          cardHover: "var(--bg-card-hover)"
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          dark: "var(--text-dark)",
          muted: "var(--text-muted)"
        },
        accent: {
          primary: "var(--accent-primary)",
          hover: "var(--accent-hover)",
          gold: "var(--accent-gold)"
        },
        border: {
          light: "var(--border-light)",
          subtle: "var(--border-subtle)"
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"]
      }
    }
  },
  plugins: [],
}
