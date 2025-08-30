/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/C:/Users/**/Application Data/**',
        '**/C:/Users/**/Cookies/**',
        '**/C:/Users/**/AppData/**',
        '**/C:/Windows/**',
      ],
    };

    config.snapshot = {
      managedPaths: [/node_modules/, /\.next/],
      // do not use excludedPaths (invalid in Next.js 15 / Webpack)
    };

    return config;
  },
};

export default nextConfig;
