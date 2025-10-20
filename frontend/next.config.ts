import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5125',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ejemplo.com',
        port: '',
        pathname: '/fotos/**',
      },
    ],
  },
};

export default nextConfig;


