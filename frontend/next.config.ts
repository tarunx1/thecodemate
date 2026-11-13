import type { NextConfig } from 'next';
const backend = process.env.TC_BACKEND_URL || 'http://127.0.0.1:8000';
const nextConfig: NextConfig = {
  distDir: process.env.TC_NEXT_DIST_DIR || '.next',
  devIndicators: false,
  turbopack: { root: process.cwd() },
  async rewrites() { return [
    { source: '/api/:path*', destination: `${backend}/api/:path*` },
    { source: '/media/:path*', destination: `${backend}/media/:path*` },
  ]; },
};
export default nextConfig;
