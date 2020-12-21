const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|ru|cn/),
    ],

    optimization: {
      runtimeChunk: 'single',
      moduleIds: 'hashed',
      splitChunks: {
        chunks: 'all',
        maxSize: 300000,
        maxInitialRequests: Infinity,
        cacheGroups: {
          styles: {
            name: 'chunk-styles',
            test: (m) => m.constructor.name === 'CssModule',
            chunks: 'all',
            minChunks: 2,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
  },

  css: {
    loaderOptions: {
      sass: {
        sourceMap: true,
        prependData: `@import "@/assets/scss/_variables";
                      @import "@/assets/scss/_mixins";`,
        sassOptions: {
          outputStyle:
            process.env.NODE_ENV === 'production' ? 'compressed' : undefined,
        },
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
};
