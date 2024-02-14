/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // design breakpoints order: mobile => tablet(768) => laptop(1024)
    screens: {
      md: "768px", // tablet
      lg: "1024px", // laptop
    },
    extend: {},
  },
  daisyui: {
    themes: [
      {
        lazyTurtle: {
          primary: "#263238",
          secondary: "#d926a9",
          accent: "#1fb2a6",
          neutral: "#2a323c",
          "base-100": "#F0F8FF",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
