const webpack = require('webpack');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        os: false,
        // fs: require.resolve('browserify-fs'), if is requiered for the server, install dependencies
        // os: require.resolve('os-browserify/browser'),
      };
    }

    return config;
  },
};