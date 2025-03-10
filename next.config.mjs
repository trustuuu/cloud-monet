/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "imagedelivery.net",
      },
    ],
    //domains: ["avatars.githubusercontent.com"],
  },
};
// const nextConfig = {
//     reactStrictMode: true,
//     swcMinify: true,
//     // except for webpack, other parts are left as generated
//     webpack: (config, context) => {
//       config.watchOptions = {
//         poll: 1000,
//         aggregateTimeout: 300
//       }
//       return config
//     }
//   }

export default nextConfig;
