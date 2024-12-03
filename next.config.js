/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['api.mapbox.com'],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
