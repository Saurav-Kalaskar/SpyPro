/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.mapbox.com'],
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
