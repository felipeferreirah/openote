/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
allowedDevOrigins: ["*"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
