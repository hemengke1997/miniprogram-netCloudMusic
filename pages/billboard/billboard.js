// pages/billboard/billboard.js
const baseURL = require('../../utils/baseURL/baseURL.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playlist: {},
    navbar: {
      showCapsule: true,
      title: '歌单',
      bgUrl: ''
    },
    navbarHeight: app.globalData.navbarHeight,
    songTotalNumber: 0,
    playCount: 0,
    songs: {}
  },

  queryBillboard(id) {
    let _this = this
    wx.request({
      url: baseURL + `playlist/detail?id=${id}`,
      method: 'GET',
      success: function(res) {
        let playlist = res.data.playlist
        console.log(playlist)
        _this.setData({
          playlist: playlist,
          songTotalNumber: playlist.trackCount,
          playCount: _this.transCount(playlist.playCount),
          "navbar.bgUrl": playlist.coverImgUrl,
          songs: {
            playlist: playlist.tracks,
            showIndex: true
          }
        })
      }
    })
  },

  // 收听量数字转换
  transCount(count) {
    let param = {}
    let k = 10000
    let size = ['', '万', '亿', '万亿']
    if (count < k) {
      param.count = count
      param.unit = ''
    } else {
      let i = Math.floor(Math.log(count) / Math.log(k))
      param.count = (count / Math.pow(k, i)).toFixed(1)
      param.unit = size[i]
    }
    return param
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryBillboard(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      let data = res.target.dataset
      return {
        title: `分享${this.data.navbar.title}：${data.title}`,
        imageUrl: data.imageurl
      }

    }
  }
})