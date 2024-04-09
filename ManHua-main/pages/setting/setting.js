// pages/setting/setting.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: '', // 头像链接
        name: '', // 姓名
        intro: '', // 个人简介
      },

    // 修改头像
    changeAvatar() {
    wx.chooseMedia({
        count: 1,
        mediaType:"image",
        sourceType: ['album', 'camera'],
        success: (res) => {
        const tempFilePaths = res.tempFiles[0].tempFilePath;
        console.log(res)
        // 上传头像并更新数据
        // ...
            this.setData({
                avatarUrl: tempFilePaths
            });
        }
    });
    },

    // 输入姓名
  inputName(e) {
    const name = e.detail.value;
    this.setData({
      name: name
    });
  },

  // 输入个人简介
  inputIntro(e) {
    const intro = e.detail.value;
    this.setData({
      intro: intro
    });
  },

  // 保存设置
  saveSettings() {
    // 将数据保存到服务器
    // ...
    
    const userInfo = {
      avatarUrl: this.data.avatarUrl,
      name: this.data.name == '' ? "微信用户" : this.data.name,
      introduction: this.data.intro == '' ? "这里是用户的简介介绍" : this.data.intro,
    }
    wx.setStorageSync('userInfo', userInfo)
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000
    });
  },

  returnUpLevelHandle: function () {
        wx.navigateBack({
            delta: 1
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var userInfo = wx.getStorageSync('userInfo')
      this.setData({
        avatarUrl:userInfo.avatarUrl,
        name:userInfo.name,
        intro:userInfo.introduction
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
})