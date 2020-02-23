//app.js
App({
  // 获取设备顶部窗口高度
  getStatusBarHeight() {
    let systemInfo = wx.getSystemInfoSync()
    let statusBarHeight = systemInfo.statusBarHeight
    let rect = wx.getMenuButtonBoundingClientRect() ? wx.getMenuButtonBoundingClientRect() : null
    let navbarHeight = 0
    if (rect) {
      navbarHeight = (function() {
        let gap = rect.top - statusBarHeight
        return 2 * gap + rect.height + statusBarHeight
      })()

    } else {
      let platform = systemInfo.platform
      let gap = ''
      let width = 96 //胶囊的宽度，android大部分96，ios为88
      if (platform === 'android') {
        gap = 8
        width = 96
      } else if (platform === 'devtools') {
        if (ios) {
          gap = 5.5 //开发工具中ios手机
        } else {
          gap = 7.5 //开发工具中android和其他手机
        }
      } else {
        gap = 4
        width = 88
      }
      //获取不到胶囊信息就自定义重置一个
      rect = {
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width: width
      }
    }
    if (!statusBarHeight) {
      // 开启wifi的情况下修复statusBarHeight值获取不到
      statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20
    }
    this.globalData.navbarHeight = navbarHeight
    this.globalData.statusBarHeight = statusBarHeight
    this.globalData.capsuleData = rect
  },
  // 播放声音
  setVolumn() {
    if (typeof wx.setInnerAudioOption === 'function') {
      wx.setInnerAudioOption({
        obeyMuteSwitch: false,
        mixWithOther: true,
        success: res => {
          console.log('调用成功')
        },
        fail: res => {
          console.log('调用失败')
        }
      })
    }
  },
  onLaunch: function() {
    this.getStatusBarHeight()
    this.setVolumn()
  },
  globalData: {
    navbarHeight: 0,
    statusBarHeight: 0,
    capsuleData: {}
  }
})