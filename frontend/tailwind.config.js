/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
          light: "#DBEAFE",
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          900: "#0F172A",
        },
        navy: "#0F172A",
        page: "#F8FAFC",
        surface: "#FFFFFF",
        success: "#16A34A",
        danger: "#DC2626",
        border: "#E2E8F0",
        muted: "#64748B",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        panel: "0 1px 3px rgb(15 23 42 / 0.06)",
        elevated: "0 10px 25px -5px rgb(15 23 42 / 0.08), 0 8px 10px -6px rgb(15 23 42 / 0.05)",
      },
      maxWidth: {
        workspace: "1600px",
      },
    },
  },
  plugins: [],
};
