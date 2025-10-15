const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Find the rule that uses source-map-loader
      const rule = webpackConfig.module.rules.find(
        (rule) =>
          rule.use &&
          rule.use.some(
            (use) =>
              typeof use.loader === 'string' &&
              use.loader.includes('source-map-loader')
          )
      );

      if (rule) {
        // Add an exclude path for the problematic packages
        const packagesToExclude = [
          path.resolve(__dirname, 'node_modules/three'),
          path.resolve(__dirname, 'node_modules/@react-three/drei'),
          path.resolve(__dirname, 'node_modules/troika-three-text'),
          path.resolve(__dirname, 'node_modules/troika-three-utils'),
        ];

        if (!rule.exclude) {
          rule.exclude = [];
        }
        rule.exclude = rule.exclude.concat(packagesToExclude);
      }

      return webpackConfig;
    },
  },
};