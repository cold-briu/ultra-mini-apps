/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },

  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination:
          'https://api.farcaster.xyz/miniapps/hosted-manifest/0198a4e6-ab68-26f5-35e9-bc1699ec73df',
        permanent: false, // temporary redirect
        statusCode: 307,  // explicitly force 307 instead of default 308
      },
    ];
  },
};

export default nextConfig;
