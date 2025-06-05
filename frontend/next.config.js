/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.cache = false;

    if (!isServer) {
      // Suppress "Critical dependency" warnings on client-side build
      config.ignoreWarnings = [
        {
          message: /Critical dependency: the request of a dependency is an expression/,
        },
      ];
    }

    return config;
  },
};

module.exports = nextConfig;
