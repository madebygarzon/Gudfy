const webpack = require('webpack');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        // fs: false,
        // os: false,
        fs: require.resolve('browserify-fs'), 
        os: require.resolve('os-browserify/browser'),
      };
    }

    return config;
  },
};