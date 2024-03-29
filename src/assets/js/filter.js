import Vue from 'vue'
Vue.filter('imgUrl', function (data) {
  if (data) {
    return 'https://hb.rgoo.com/' + data
    // return 'https://sz.rgoo.com/' + data
  } else {
    return 'https://hb.rgoo.com/upload/shop/moren.jpg'
    // return 'https://sz.rgoo.com/upload/shop/moren.jpg'
  }
})

Vue.filter('time', function (data, type) {
  if (!data) return ''
  let date = new Date(data)
  let Y = date.getFullYear()
  let M = date.getMonth() + 1
  let D = date.getDate()
  let h = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  M = M >= 10 ? M : '0' + M
  D = D >= 10 ? D : '0' + D
  h = h >= 10 ? h : '0' + h
  m = m >= 10 ? m : '0' + m
  s = s >= 10 ? s : '0' + s
  switch (type) {
    case 'y-m-d':
      return Y + '-' + M + '-' + D
    case 'ymdhm':
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m
  }
})