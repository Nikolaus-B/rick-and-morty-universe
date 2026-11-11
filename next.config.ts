import type { NextConfig } from "next";
const config: NextConfig = { images: { remotePatterns: [{ hostname: "rickandmortyapi.com" }] } };
export default config;
