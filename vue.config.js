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
        prependData: `@import "@/assets/scss/_variables";
                      @import "@/assets/scss/_mixins";`
      }
    }
  }
};
