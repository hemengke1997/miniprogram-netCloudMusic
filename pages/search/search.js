// pages/search/search.js
const baseURL = require('../../utils/baseURL/baseURL.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    searchHistory: '',
    hotSongs: [],
    searchSug: []
  },

  inputSearchValue(e) {
    let value = e.detail.value
    console.log(value,'value')
    this.setData({
      searchValue: value
    })
    // 调用查询接口
    if(value) {
      this.searchSong(value)
    } 
  },
  // 查询歌曲接口
  searchSong(value) {
    let _this = this
    wx.request({
      url: baseURL + `search/suggest?keywords=${value}&type=mobile`,
      method: 'GET',
      success: function(res) {
        console.log(res)
        let data = res.data.result.allMatch
        _this.setData({
          searchSug: data
        })
      }
    })
  },
  clearSearchValue() {
    this.setData({
      searchValue: ''
    })
  },

  // 从本地存储中获取搜索历史记录
  getSearchHistory() {
    try {
      let value = wx.getStorage('searchHistory')
      if (value) {
        // 
        this.searchHistory = value
      }
    } catch (e) {
      console.log('no history')
    }
  },
  // 获取热歌榜
  getHotBillboard() {
    let _this = this
    wx.request({
      url: baseURL + 'search/hot/detail',
      method: 'GET',
      success: function(res) {
        _this.setData({
          hotSongs: res.data.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchHistory()
    this.getHotBillboard()
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