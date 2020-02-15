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
      title: '榜单'
    },
    navbarHeight: app.globalData.navbarHeight
  },

  queryBillboard(id) {
    let _this = this
    wx.request({
      url: baseURL + `playlist/detail?id=${id}`,
      method: 'GET',
      success: function (res) {
        console.log(res)
        _this.setData({
          playlist: res.data.playlist
        })
      }
    })
  },
  // 分享歌单给微信好友
  shareToFriend() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryBillboard(options.id)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})