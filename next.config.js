/** @type {import("next").NextConfig} */
module.exports = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "vumbnail.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.dailymotion.com",
        port: "",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};
