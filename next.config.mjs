/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Les pages SEO programmatiques sont générées en SSG (generateStaticParams).
  // On peut activer l'ISR plus tard via `export const revalidate = 86400`.
};

export default nextConfig;
