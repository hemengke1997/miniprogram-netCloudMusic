const baseURL = require('../../utils/baseURL/baseURL.js')

Page({
  data: {
    bangdan: [{
      imgSrc: '../../assets/imgs/bsb.jpg'
    }, {
      imgSrc: '../../assets/imgs/xgb.jpg'
    }, {
      imgSrc: '../../assets/imgs/rgb.jpg'
    }, {
      imgSrc: '../../assets/imgs/ycb.jpg'
    }]
  },
  // 获取飙升榜
  getBsb() {
    wx.request({
      url: baseURL + 'toplist/detail',
      method: 'GET',
      success: function(res) {
        console.log(res,'res')
      }
    })
  },
  onLoad() {
    this.getBsb()
  },

})