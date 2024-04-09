Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    hasUserInfo:false,
  },

  login: function() {
    // 处理登录逻辑
    // console.log(wx.getStorageSync('openid'))
    const self = this

    if (wx.getStorageSync('openid') == ''){
      wx.login({
        success: function(res) {
          if (res.code) {
            // 登录成功，获取到用户的登录凭证 code
            var code = res.code;
            console.log(res)
            // 在这里可以将 code 发送给后端服务器进行验证，获取用户信息等操作
            // 例如：
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx5b8c2ed7e52957f9&secret=f81eb2b2807d0b5996f1e2ce839a342b&grant_type=authorization_code&js_code=' + code,
              method: 'POST',
              success: function(response) {
                // 处理登录成功的逻辑
                // console.log(response)
                
                wx.setStorageSync('openid', response.data.openid)

                self.setData({
                  hasUserInfo: true,
                })
              },
              fail: function(error) {
                // 处理登录失败的逻辑
                // ...
                console.log(error)
              }
            });
          } else {
            // 登录失败，处理错误信息
            console.log('登录失败：' + res.errMsg);
          }
        },
        fail: function(error) {
          // 处理登录失败的逻辑
          console.log('登录失败：' + error.errMsg);
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('openid') != ''){ 
      this.setData({
        hasUserInfo: true,
      })
    }
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
    if (wx.getStorageSync('openid') != ''){
      this.setData({
        hasUserInfo: true
      })
    }else{
      this.setData({
          hasUserInfo: false
      })
    }

    var userInfo = {
      avatarUrl: '/static/images/other/user_index.png',
      name: '微信用户',
      introduction: '这里是用户的简介介绍',
    };

    if (wx.getStorageSync('userInfo') == ''){
      wx.setStorageSync('userInfo', userInfo);
    }else{
      userInfo = wx.getStorageSync('userInfo')
    }

    this.setData({
      userInfo:userInfo
    })

    //添加选中效果
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      //自定义组件的getTabBar 方法，可获取当前页面下的自定义 tabBar 组件实例。
      this.getTabBar().setData({
        selected: 4 //这个是tabBar中当前页对应的下标
      });
    }
  },
  buttonStart: function(e) {
    startPoint = e.touches[0]
  },

  buttonMove: function(e) {
    var endPoint = e.touches[e.touches.length - 1]
    var translateX = endPoint.clientX - startPoint.clientX

    startPoint = endPoint;
    var buttonLeft = this.data.buttonLeft + translateX;
    if (buttonLeft > max) {
      return
    }
    if (buttonLeft < min) {
      return
    }
    console.log(buttonLeft)
    this.setData({
      // buttonTop: buttonTop,
      buttonLeft: buttonLeft,
      progress: buttonLeft - min,
      //
    })
  },


  logout: function() {
    // 执行注销操作，例如清除用户登录信息，退出登录状态等
    
    wx.setStorageSync('openid', '')
    this.setData({
      hasUserInfo:false
    })
  },

  about:function() {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  setting:function() {
    wx.navigateTo({
      url: '../setting/setting',
    })
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
});