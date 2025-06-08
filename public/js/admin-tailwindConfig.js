tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        sharetech: ["Share Tech", "sans-serif"],
      },
      colors: {
        orange: {
          // Re-adding orange palette for consistency if needed
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
        },
      },
    },
  },
  darkMode: "class", // Enable class-based dark mode
};