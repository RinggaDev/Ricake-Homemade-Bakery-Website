import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand palette
        espresso: "#3A1D10",
        "bakery-brown": "#6B350B",
        "butter-yellow": "#F5D52E",
        "warm-ivory": "#F4EEDC",
        "toasted-crust": "#B95B25",
        cocoa: "#3E302C",

        // Supporting palette
        "powder-blue": "#C4DCEB",
        "butter-cream": "#F8E8AC",
        olive: "#68764A",
        "paper-white": "#FFFCF3",
        "warm-grey": "#A79D8E",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "Bricolage Grotesque", "sans-serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
      },
      boxShadow: {
        retro: "2px 2px 0px #3A1D10",
        "retro-md": "3px 3px 0px #3A1D10",
        "retro-lg": "4px 4px 0px #3A1D10",
        "retro-xl": "6px 6px 0px #3A1D10",
        "retro-orange": "8px 8px 0px #B95B25",
        "retro-white": "3px 3px 0px #FFFCF3",
      },
      borderRadius: {
        card: "14px",
      },
      maxWidth: {
        container: "1320px",
      },
    },
  },
  plugins: [],
};

export default config;
