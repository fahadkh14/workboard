/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        bg: "var(--wb-bg)",
        surface: "var(--wb-surface)",
        elevated: "var(--wb-elevated)",
        border: "var(--wb-border)",
        primary: "var(--wb-primary)",
        secondary: "var(--wb-secondary)",
        text: "var(--wb-text)",
        muted: "var(--wb-muted)",
        success: "var(--wb-success)",
        warning: "var(--wb-warning)",
        danger: "var(--wb-danger)",
        info: "var(--wb-info)",
      },
      borderRadius: {
        card: "16px",
        btn: "11px",
        input: "11px",
        modal: "20px",
      },
      boxShadow: {
        subtle: "0 1px 2px rgba(15, 15, 30, 0.06)",
        elevated: "0 8px 30px rgba(15, 15, 30, 0.10)",
        "elevated-dark": "0 8px 30px rgba(0, 0, 0, 0.45)",
      },
      spacing: {
        4.5: "18px",
      },
    },
  },
  plugins: [],
};
