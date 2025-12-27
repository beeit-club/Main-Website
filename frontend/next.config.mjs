/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tuisui.site",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.fhan14-1.fna.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.fhan14-2.fna.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.fhan14-3.fna.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.fhan14-4.fna.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.fhan14-5.fna.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
    // Cho phép tất cả các domain từ env variable (development)
    // Trong production, nên chỉ định cụ thể các domain
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Giảm logging trong development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

// Thêm backend URL vào remotePatterns nếu có trong env
if (process.env.NEXT_PUBLIC_API_BACKEND) {
  try {
    const backendUrl = new URL(process.env.NEXT_PUBLIC_API_BACKEND);
    nextConfig.images.remotePatterns.push({
      protocol: backendUrl.protocol.replace(':', '') || 'http',
      hostname: backendUrl.hostname,
      port: backendUrl.port || undefined,
      pathname: '/**',
    });
  } catch (e) {
    console.warn('Could not parse NEXT_PUBLIC_API_BACKEND for image config:', e);
  }
}

export default nextConfig;
