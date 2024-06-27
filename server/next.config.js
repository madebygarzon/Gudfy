const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias['@medusajs/admin-ui/ui/index.html'] = path.join(__dirname, 'src/admin/ui/index.html');
    return config;
  },
};
