/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        aquarium: "url('./public/bg.jpg')",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
