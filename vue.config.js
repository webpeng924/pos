module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/POS/' : '/',
  // devServer: {
  //   proxy: {
  //     '/s': {
  //       target: 'https://sz.rgoo.com/api/api.php',// 要跨域的域名
  //       changeOrigin: true, // 是否开启跨域
  //       pathRewrite: {
  //         '^/s': '/s/' // 在请求的时候 凡是/s开头的地址都可以跨域
  //       }
  //     }
  //   }
  // }
}