/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Allow Vanta.js to import properly (it looks for THREE as a global)
    config.externals = config.externals || [];
    return config;
  },
};

module.exports = nextConfig;
