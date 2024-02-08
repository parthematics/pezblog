/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.split("://")[1],
        port: "",
        pathname: "/storage/v1/object/public/images/**",
      },
    ],
  },
};

export default nextConfig;
