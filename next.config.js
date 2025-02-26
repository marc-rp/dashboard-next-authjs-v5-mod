/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // calling useeffect twice fix
  // images: {
  //   domains: ["utfs.io", "cdn.uploadthing.com"], // Adicione os domínios do UploadThing
  // },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

module.exports = {
  ...nextConfig,
  images: {
    // domains: ["utfs.io", "x7prftr3z3.ufs.sh"],
    domains: ["res.cloudinary.com"],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/api/uploadthing",
  //       headers: [
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         { key: "Access-Control-Allow-Methods", value: "POST" },
  //       ],
  //     },
  //   ];
  // },
};
