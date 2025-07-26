/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/gh/**',
      },
      {
        protocol: 'https',
        hostname: 'aframe.io',
        port: '',
        pathname: '/releases/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/npm/**',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      'mind-ar': 'MINDAR',
      'aframe': 'AFRAME',
    });
    return config;
  }
}

export default nextConfig
