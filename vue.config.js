module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  devServer: {
   proxy: {
      '/api': {
        target: 'http://192.168.132.5:7072',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: { '^/psb': ''  },
      }
    },
  }
}
