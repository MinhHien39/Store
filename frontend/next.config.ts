import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode
  reactStrictMode: true,

  // Skip TypeScript errors during build (matches original Vite project behavior)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow images from external sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Redirect API requests to backend
  async rewrites() {
    // Use internal Docker URL for server-side proxying; fall back to public URL for local dev
    const backendUrl = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
