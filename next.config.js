/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ignored: [
        /node_modules/,
        /\.git/,
        /C:\/Users\/.*\/Cookies/,
        /C:\/Users\/.*\/AppData/,
      ]
    }
    return config
  }
}

module.exports = nextConfig