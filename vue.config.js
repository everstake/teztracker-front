const webpack = require('webpack');

module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new webpack.ContextReplacementPlugin(
          /moment[/\\]locale$/,
          /en|ru|cn/
      )
    ]
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/scss/_variables";
                      @import "@/assets/scss/_mixins";`
      }
    }
  }
};
