import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15 ships legacy configs, so load them through FlatCompat
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });
export default [...compat.extends("next/core-web-vitals", "next/typescript"), { ignores: [".next/**", "next-env.d.ts"] }];
