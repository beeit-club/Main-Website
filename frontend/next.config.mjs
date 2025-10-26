/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**", // cho phép tất cả path của domain
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**", // cho phép tất cả path của domain
      },
    ],
  },
};

export default nextConfig;
