// pages/search/search.js
const baseURL = require('../../utils/baseURL/baseURL.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    searchHistory: [],
    hotSongs: [],
    searchSug: [],
    showSongs: false,
    noMatch: false,
    offset: 0,
    count: 0,
    songs: {}
  },
  /**
   * 不渲染的数据
   */
  vars: {
    limit: 30,
    maxOffset: 0
  },
  inputSearchValue(e) {
    let value = e.detail.value
    this.setData({
      searchValue: value,
      showSongs: false
    })
    // 调用查询接口
    if (value) {
      this.searchSong(value)
    }
    // 重置offset
    this.setData({
      offset: 0
    })
    this.scrollToTop()
  },
  // 滚动到顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
  },
  // 查询歌曲接口
  searchSong(value) {
    let _this = this
    wx.request({
      url: baseURL + `search/suggest?keywords=${value}&type=mobile`,
      method: 'GET',
      success: function(res) {
        // console.log(res, 'xxxxxxx')
        if (res.data.result) {
          let data = res.data.result.allMatch
          _this.setData({
            searchSug: data,
            noMatch: false
          })
        } else {
          _this.setData({
            noMatch: true
          })
        }
      }
    })
  },
  clearSearchValue() {
    this.setData({
      searchValue: '',
      songs: {},
      showSongs: false,
      offset: 0
    })
    this.scrollToTop()
  },

  // 从本地存储中获取搜索历史记录
  getSearchHistory() {
    try {
      let value = wx.getStorageSync('searchHistory')
      if (value) {
        this.setData({
          searchHistory: value
        })
        return value
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
  // 精确搜索
  exactSearch(value) {
    let _this = this
    wx.request({
      url: baseURL + `search?keywords=${value}&type=1&offset=${_this.data.offset}`,
      method: 'GET',
      success: (res) => {
        console.log(res)

        let data = res.data.result.songs
        let songs = data.map(item => {
          return {
            name: item.name,
            ar: [{
              name: item.artists[0].name
            }],
            al: {
              name: item.album.name
            },
            id: item.id
          }
        })
        _this.setData({
          count: res.data.result.songCount,
          songs: {
            playlist: _this.data.offset ? _this.data.songs.playlist.concat(songs) : songs,
            showIndex: true
          }
        })
        console.log(_this.data.songs)
        if (_this.data.offset === 0) {
          _this.vars.maxOffset = _this.data.count / _this.vars.limit
          // 添加历史记录
          _this.setSearchHistory()
        }
      }
    })
  },
  // 添加历史记录
  setSearchHistory() {
    let key = 'searchHistory'
    let value = this.data.searchValue
    let oldValue = this.getSearchHistory() || []
    if (oldValue.length) {
      let index = oldValue.indexOf(value)
      if (index !== -1) {
        oldValue.splice(index, 1)
      }
    }
    oldValue.push(value)
    this.setData({
      searchHistory: oldValue
    })
    wx.setStorageSync(key, oldValue)
  },
  // 点击搜索建议或历史记录
  searchSug(e) {
    let searchName = e.currentTarget.dataset.searchname
    this.setData({
      searchValue: searchName,
      showSongs: true
    })
    this.scrollToTop()
    this.exactSearch(searchName)
  },
  // 点击搜索出来的项目
  searchOne(e) {
    let song = e.currentTarget.dataset.songname
    this.setData({
      showSongs: true,
      searchValue: song
    })
    this.exactSearch(song)
  },
  // 键盘点击完成
  confirmSearch(e) {
    let value = e.detail.value
    this.setData({
      showSongs: true,
      searchValue: value
    })
    this.exactSearch(value)
  },
  // 清除历史记录
  clearHistory() {
    this.setData({
      searchHistory: []
    })
    wx.setStorageSync('searchHistory', [])
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getHotBillboard()
    this.getSearchHistory()
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
    // 懒加载歌曲
    if (this.data.showSongs) {
      if (this.data.count <= this.vars.limit) return
      let n = ++this.data.offset
      if (n <= this.vars.maxOffset && this.data.searchValue) {
        this.exactSearch(this.data.searchValue)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})