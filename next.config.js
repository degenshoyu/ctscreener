// next.config.js
module.exports = {
    async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://auth.privy.io",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.externals = config.externals || {};
    config.externals['@solana/web3.js'] = 'commonjs @solana/web3.js';
    config.externals['@solana/spl-token'] = 'commonjs @solana/spl-token';
    return config;
  },
};

