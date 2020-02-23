const app = getApp()
Component({
  // 属性定义 (父子通信)
  properties: {
    navbarNeed: {
      type: Object,
      value: {}
    }
  },
  data: { // 私有数据（对内），可用于模板渲染
    navbarHeight: '',
    statusBarHeight: '',
    showCapsule: false,
    title: '',
    capsuleData: {},
    bgUrl: '',
    windowWidth: 0,
    navClass: 'bg'
  },
  methods: {
    goBack() {
      wx.navigateBack()
    },
    goHome() {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    computePosition() {
      let capsuleData = app.globalData.capsuleData
      let systemInfo = wx.getSystemInfoSync()
      let left = systemInfo.windowWidth - capsuleData.right
      let top = capsuleData.top
      let height = capsuleData.height
      let width = capsuleData.width
      let windowWidth = systemInfo.windowWidth
      this.setData({
        capsuleData: {
          left: left,
          top: top,
          height: height,
          width: width,
        },
        windowWidth: windowWidth
      })
    },
    setAllData() {
      // 设置导航栏高度、title
      this.setData({
        navbarHeight: app.globalData.navbarHeight,
        statusBarHeight: app.globalData.statusBarHeight,
      })
    }
  },
  attached: function() {
    // 计算左胶囊的定位信息
    this.computePosition()
    this.setAllData()
  },
  observers: {
    'navbarNeed': function(value) {
      if (Object.keys(value).length) {
        this.setData({
          bgUrl: this.data.navbarNeed.bgUrl || '',
          title: this.data.navbarNeed.title,
          showCapsule: this.data.navbarNeed.showCapsule,
          navClass: this.data.navbarNeed.navClass || 'bg'
        })
      }
    }
  }
})