import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      "animation": {
        "fade-in-up": "fade-in-up 0.6s ease-in-out",
        "background-shine": "background-shine 2s linear infinite",
        "border-width": "border-width 3s infinite alternate"
      },
      "fade-in-up": {
        "0%": {
          "opacity": "0",
          "transform": "translateY(20px)"
        },
        "100%": {
          "opacity": "1",
          "transform": "translateY(0)"
        }
      },
      "keyframes": {
        "background-shine": {
          "from": {
            "backgroundPosition": "0 0"
          },
          "to": {
            "backgroundPosition": "-200% 0"
          }
        },
        "border-width": {
          "from": {
            "width": "10px",
            "opacity": "0"
          },
          "to": {
            "width": "400px",
            "opacity": "1"
          }
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],

};
export default config;
