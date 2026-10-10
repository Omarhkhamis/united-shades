import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "node_modules/**", "legacy-static/**", "drizzle/**", "next-env.d.ts"] },
  {
    rules: {
      // the site keeps plain <img> on purpose so markup/CSS stay identical to the original design
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
