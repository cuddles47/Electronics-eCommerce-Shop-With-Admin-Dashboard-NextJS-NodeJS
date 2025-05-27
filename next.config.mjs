/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'placehold.co',
            port: ""
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: ""
          },
        ],
    },
    // Add this configuration to handle static pages more carefully
    experimental: {
      // This helps with pages that might have data fetching errors during build
      missingSuspenseWithCSRFallback: true,
    },
};

export default nextConfig;
