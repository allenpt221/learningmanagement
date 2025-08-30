/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules',
        '**/.git',
        'C:/Users/allen/Application Data',
        'C:/Users/allen/AppData',
      ],
    };
    return config;
  },
};

export default nextConfig;
