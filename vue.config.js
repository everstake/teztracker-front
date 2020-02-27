const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(
          /moment[/\\]locale$/,
          /en|ru|cn/
      )
    ]
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/styles/scss/index";`
      }
    }
  }
};
