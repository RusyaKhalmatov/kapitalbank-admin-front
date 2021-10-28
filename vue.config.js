module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
   proxy: {
      '/api': {
        target: 'http://192.168.132.5:7072', // http://191.168.6.78:19191/courses/php/get_courses.php
        // ws: true,
        changeOrigin: true,
        logLevel: 'debug',
        // cookieDomainRewrite: "localhost",
        // secure: false
        pathRewrite: { '^/psb': ''  },
      }
    },
    historyApiFallback: true
  }
}
