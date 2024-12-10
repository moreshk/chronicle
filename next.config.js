/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['nftstorage.link'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };
    return config;
  },
}

module.exports = nextConfig 