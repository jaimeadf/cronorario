import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        primary: colors.white,
        secondary: colors.white,
        tertiary: colors.gray[100],
        "primary-hover": colors.gray[100],
        "tertiary-hover": colors.gray[200],
        brand: colors.rose[500],
      },
      textColor: {
        primary: colors.black,
        secondary: colors.gray[700],
        tertiary: colors.gray[400],
        brand: colors.rose[500],
        onbrand: colors.white,
      },
      borderColor: {
        primary: colors.gray[200],
        secondary: colors.gray[100],
        brand: colors.rose[500],
        ontertiary: colors.white,
        onbrand: colors.white,
      },
      outlineColor: {
        "bg-primary": colors.white,
      },
    },
  },
  plugins: [],
};

export default config;
