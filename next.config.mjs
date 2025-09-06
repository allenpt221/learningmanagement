import path from "path";

const nextConfig = {
  webpack: (config) => {
    console.log("Webpack context:", config.context);
    return config;
  },
};

export default nextConfig;