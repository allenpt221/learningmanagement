// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/C:/Users/allen/Application Data/**', // use glob pattern instead of path.resolve
      ],
    };
    return config;
  },
};

module.exports = nextConfig;
