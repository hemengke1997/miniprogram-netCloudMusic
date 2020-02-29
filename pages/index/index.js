const baseURL = require('../../utils/baseURL/baseURL.js')

Page({
  data: {
    bangdan: []
  },
  // 获取四个榜单
  getBillBoard() {
    let _this = this
    wx.request({
      url: baseURL + 'toplist/detail',
      method: 'GET',
      success: function(res) {
        
        let data = res.data.list.slice(0, 4)
        console.log(data)
        _this.setData({
          bangdan: data
        })
      }
    })
  },
  gotoSearch() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  // 点击歌单跳转
  gotoSongs(e) {
    let id = e.currentTarget.dataset.id
    // 先跳转
    wx.navigateTo({
      url: `../billboard/billboard?id=${id}`,
    })
  },
  onLoad() {
    this.getBillBoard()
  }
})