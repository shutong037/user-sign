'use strict'
const path = require('path')
const TimeStamp = new Date().getTime();

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: `http://test.zr12312.com/`,
        ws: true,
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          '': ''
        }
      }
    },
    disableHostCheck: true
  },
  lintOnSave: true,
  chainWebpack: (config) => {
    config.plugin('html')
    .tap((args) => {
        args[0].title = '助涨财富班';
        return args;
    });
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))

  },
  productionSourceMap: false
}
