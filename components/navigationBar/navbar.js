const app = getApp()
Component({
  // 属性定义 (父子通信)
  properties: {
    navbarNeed: {
      type: Object,
      value: {},
      observer: function(newVal, oldVal) {}
    }
  },
  data: { // 私有数据（对内），可用于模板渲染
    navbarHeight: '',
    statusBarHeight: '',
    showCapsule: false,
    title: '',
    capsuleData: {}
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
      this.setData({
        capsuleData: {
          left: left,
          top: top,
          height: height,
          width: width
        }
      })
    },
    setAllData() {
      // 设置导航栏高度、title
      this.setData({
        navbarHeight: app.globalData.navbarHeight,
        statusBarHeight: app.globalData.statusBarHeight,
        title: this.data.navbarNeed.title,
        showCapsule: this.data.navbarNeed.showCapsule
      })
    }
  },
  attached: function() {
    // 计算左胶囊的定位信息
    this.computePosition()
    this.setAllData()
  },
})