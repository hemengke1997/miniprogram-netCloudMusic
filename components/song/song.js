// components/song.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    songs: {
      type: Object,
      value: {
        playlist: [],
        showIndex: true
      },
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    songData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转到单曲页面
    gotoSong(e) {
      wx.navigateTo({
        url: '/pages/music/music?id=' + e.currentTarget.dataset.songid,
      })
    }
  },

  /**
   * 组件生命周期
   */
  lifetimes: {

  },

  /**
   * 组件所在的页面的生命周期
   */
  pageLifetimes: {
    show: function() {}
  },

  /**
   * 监听器
   */
  observers: {
    'songs': function(songs) {
      
      if (songs.playlist && songs.playlist.length) {
        console.log(songs)
        this.setData({
          songData: {
            playlist: songs.playlist,
            showIndex: songs.showIndex === undefined ? true : songs.showIndex
          }
        })
      }
    }
  }
})