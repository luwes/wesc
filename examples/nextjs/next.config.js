/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config

    if (!isServer) {
      config.resolve.alias['wesc/server'] = false;
    }

    return config
  },
}

module.exports = nextConfig
