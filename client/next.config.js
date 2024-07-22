const { withStoreConfig } = require("./store-config")
const store = require("./store.config.json")
const path = require("path")

module.exports = withStoreConfig({
  experimental: {
    serverActions: true,
  },
  features: store.features,
  reactStrictMode: true,
  images: {
    domains: [
      "medusa-public-images.s3.eu-west-1.amazonaws.com",
      "localhost",
      "medusa-server-testing.s3.amazonaws.com",
      "179.61.219.62",
      "public.bnbstatic.com", //para la QR de Binance
    ],
  },
  webpack: (config, { isServer }) => {
    // Agregar resoluciones y alias necesarios
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        // assert: require.resolve('assert'),
        crypto: require.resolve("crypto-browserify"),
        // http: require.resolve('stream-http'),
        // https: require.resolve('https-browserify'),
        // os: require.resolve('os-browserify/browser'),
        stream: require.resolve("stream-browserify"),
      },
      alias: {
        ...config.resolve.alias,
        process: "process/browser",
      },
    }

    // Configuración adicional para el servidor si es necesario
    if (isServer) {
      // Aquí puedes agregar configuración específica del servidor si es necesario
    }

    return config
  },
})

console.log("next.config.js", JSON.stringify(module.exports, null, 2))
