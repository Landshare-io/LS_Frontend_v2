/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'crtstorage.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/house/**',
        search: '',
      },
    ],
  },
};

module.exports = nextConfig;
