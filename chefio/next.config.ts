import type { NextConfig } from "next";
import next from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '/chefio',
  assetPrefix: '/chefio/'
};

export default nextConfig;
