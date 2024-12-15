import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cavernous: "var(--cavernous)",
        "shoe-wax": "var(--shoe-wax)",
        "goshawk-grey": "var(--goshawk-grey)",
        "out-of-the-blue": "var(--out-of-the-blue)",
        "whitest-white": "var(--whitest-white)",
      },
    },
  },
  plugins: [],
} satisfies Config;
