const { heroui } = require("@heroui/react")

module.exports = {
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        30: "30px",
      },
      transitionProperty: {
        width: "width",
        spacing: "margin, padding",
      },
      maxWidth: {
        "8xl": "100rem",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontFamily: {
        sans: [
          "Poppins",
          /*"Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Ubuntu",
          "sans-serif",*/
        ],
      },
      colors: {
        "blue-gf": "#1F0046",
        "lila-gf": "#9B48ED",
        "purple-gf": "#9B48ED",
        "purple-secondary-gf": "#3F1C7A",
      },
      boxShadow: {
        gf: "0px 0px 10px 0px rgba(0, 0, 0, 0.68)",
        card: "1px 1px 6px 1px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [heroui()],
}
