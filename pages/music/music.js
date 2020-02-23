// pages/music/music.js
const baseURL = require('../../utils/baseURL/baseURL.js')
const app = getApp()
const musicApis = require('../../utils/apis/music.js')
const formatTime = require('../../utils/util.js').formatTime
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: {
      showCapsule: true,
      title: '',
      bgUrl: '',
      navClass: 'bg_song'
    },
    navbarHeight: app.globalData.navbarHeight,
    songData: {},
    bgImgs: {},
    songs: {},
    hotComments: [],
    noLrc: true,
    lyric: [],
    audio: {},
    playing: false,
    showSongs: true,
    currentTime: [],
    lyc_time_index: 0, // 当前歌词跟时间戳的index
    lyc_translateY: 0, // 歌词上移的距离
    lycNeedScroll: 0, //  播放时间改变时 总会触发updateTime方法 为了避免每次触发方法时都去遍历时间戳，就立了这个flag
    domQuery: {}
  },

  /**
   * 自定义方法 
   */
  getSong(id) {
    let _this = this
    musicApis.getSong(id).then(res => {
      let song = res.data.songs[0]
      console.log(song)
      _this.setData({
        songData: song,
        "navbar.title": song.name
      })
      musicApis.getAlbum(song.al.id).then(res => {
        // console.log(res)
      })
    })
  },
  getLyric(id) {
    musicApis.getLyric(id).then(res => {
      console.log(res)
      if (res.data.lrc && res.data.lrc.lyric) {
        let lyric = res.data.lrc.lyric
        let pattern1 = /\[\d{2}:\d{2}\.\d{2,3}\]/g
        let currentTime = lyric.match(pattern1)
        currentTime = currentTime.map(item => {
          return this.myAdd(
            parseInt(item.slice(1, -2).split(":")[0] * 60),
            item.slice(2, -1).split(":")[1]
          )
        })
        let other = lyric.replace(pattern1, "")
        let pattern2 = /[\r\n]/g
        let pattern3 = /\[.*\]/g
        let author = other.match(pattern3)
        console.log(author,'author')
        lyric = other.split(pattern2)
        // console.log(currentTime, ' currenttime')
        // console.log(other, '剩下的')
        // console.log(lyric, '歌词')

        this.setData({
          noLrc: false,
          lyric: lyric,
          currentTime: currentTime
        })
      }
    })
  },
  // 处理js float精度问题
  myAdd(n1, n2) {
    let len = n2.split(".")[1].length;
    let x = n1 * Math.pow(10, len);
    let y = parseInt(
      n2.toString().split(".")[0] + n2.toString().split(".")[1]
    );
    return (x + y) / Math.pow(10, len);
  },

  // 媒体查询
  mediaSea() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: res => {
          resolve(res)
        }
      })
    })
  },
  // 读取文件
  readFile(path) {
    return new Promise((resolve, reject) => {
      wx.getFileSystemManager().readFile({
        filePath: '/assets/imgs/' + path,
        encoding: 'base64',
        success: res => {
          resolve(`data:image/png;base64,${res.data}`)
        },
        fail: res => {
          reject(res)
        }
      })
    })
  },
  // 根据媒体查询结果读取对应的本地图片
  readImg() {
    this.mediaSea().then(res => {
      let screenWidth = res.screenWidth
      let blackcircle, whitecircle, needle, plybtn

      if (screenWidth <= 360) {
        blackcircle = this.readFile('disc-ip6.png')
        needle = this.readFile('needle-ip6.png')
        whitecircle = this.readFile('disc_light-ip6.png')
        plybtn = this.readFile('play_btn.png')
      } else if (screenWidth <= 414) {
        blackcircle = this.readFile('disc-plus.png')
        needle = this.readFile('needle-plus.png')
        whitecircle = this.readFile('disc_light-plus.png')
        plybtn = this.readFile('play_btn_3x.png')
      } else {
        blackcircle = this.readFile('disc_3x.png')
        needle = this.readFile('needle.png')
        whitecircle = this.readFile('disc_light.png')
        plybtn = this.readFile('play_btn.png')
      }
      Promise.all([blackcircle, needle, whitecircle, plybtn]).then(res => {
        this.setData({
          bgImgs: {
            blackcircle: res[0],
            needle: res[1],
            whitecircle: res[2],
            plybtn: res[3]
          }
        })
      })
    })
  },
  // 相似歌曲
  getSimiSongs(id) {
    musicApis.getSimiSongs(id).then(res => {
      if(res.data.songs.length === 0) {
        this.setData({
          showSongs: false
        })
        return
      }
      let playlist = res.data.songs.map(item => {
        return {
          id: item.id,
          song_img: item.album.picUrl,
          name: item.name,
          ar: [{
            name: item.artists[0].name
          }],
          al: {
            name: item.album.name
          }
        }
      })
      this.setData({
        songs: {
          playlist: playlist,
          showIndex: false
        }
      })
    })
  },
  // 获取评论
  getSongComments(id) {
    musicApis.getSongComments(id).then(res => {
      // console.log(res)
      let hotCmts = res.data.hotComments.map(item => {

        return {
          content: item.content,
          likedCount: this.formatLikeCount(item.likedCount),
          time: formatTime(item.time),
          avatarUrl: item.user.avatarUrl,
          nickname: item.user.nickname,
          vip: item.user.vipRights ? true : false
        }
      })
      this.setData({
        hotComments: hotCmts
      })
    })
  },
  // 获取歌曲url
  getSongUrl(id) {
    musicApis.getSongUrl(id).then(res => {
      console.log(res)
      let audio = wx.createInnerAudioContext()
      audio.autoplay = false
      audio.src = res.data.data[0].url
      this.setData({
        audio: audio
      })
      audio.onPlay(() => {
        const query = wx.createSelectorQuery()
        this.setData({
          domQuery: query
        })
      })
      audio.onTimeUpdate(() => {
        // 滚动歌词
        // console.log(audio.currentTime)
        for (let i = this.data.lycNeedScroll; i < this.data.currentTime.length; i++) {
          if (audio.currentTime >= this.data.currentTime[i]) {
            this.setData({
              lycNeedScroll: i + 1,
              lyc_time_index: i
            })
            if (i > 1) {
              let height = ''
              let query = this.data.domQuery.select(`#id${i-2}`).boundingClientRect()
              query.exec((res) => {
                height = res[res.length - 1].height
                this.setData({
                  lyc_translateY: this.data.lyc_translateY - height
                })
              })
            }
            break
          }
        }
      })
      audio.onEnded(() => {
        this.setData({
          playing: false,
          lyc_time_index: 0,
          lyc_translateY: 0,
          lycNeedScroll: 0
        })
      })
      audio.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
    })
  },
  // 点赞数大于10万时格式转换
  formatLikeCount(count) {
    let param = {}
    let k = 10000
    let size = ['', '万', '亿']
    if (count < k * 10) {
      param.count = count
      param.unit = ''
    } else {
      let i = Math.floor(Math.log(count) / Math.log(k))
      param.count = (count / Math.pow(k, i)).toFixed(1)
      param.unit = size[i]
    }
    return `${param.count}${param.unit}`
  },
  // 点击播放或暂停
  playsong() {
    if (this.data.audio.paused) {
      this.data.audio.play()
      this.setData({
        playing: true
      })
    } else {
      this.data.audio.pause()
      this.setData({
        playing: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    this.getSong(id)
    this.readImg(id)
    this.getSimiSongs(id)
    this.getSongComments(id)
    this.getLyric(id)
    this.getSongUrl(id)
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
      console.log(res)
      let data = res.target.dataset
      return {
        title: `分享歌曲：${data.title}`,
        imageUrl: data.imageurl
      }
    }
  }
})