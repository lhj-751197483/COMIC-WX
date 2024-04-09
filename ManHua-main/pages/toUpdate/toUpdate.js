const { getUpdateList } = require('../../services/update');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topDistance: app.globalData.statusBarHeight,
    slideList: [],
    activeIndex: 0,
    slideIndex:0,
    isHidWait: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    getUpdateList().then(slideList => {
      self.setData({ slideList, isHidWait: true });
    });
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
    // 添加选中效果
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      // 自定义组件的getTabBar 方法，可获取当前页面下的自定义 tabBar 组件实例。
      this.getTabBar().setData({
        selected: 1 // 这个是tabBar中当前页对应的下标
      });
    }
  },

  /**
  *  侧边导航按钮_点击处理
  * @param {*} event
  */
  onClickHandle: function (event) {
    const activeIndex = event.currentTarget.dataset.index;
    this.setData({ activeIndex });
  },


  onScrollViewScroll: function(event) {
    var that = this
    var query = wx.createSelectorQuery(); // 创建查询实例
    query.selectAll('.item-wrapper').boundingClientRect(); // 选择需要查询的子元素类名或选择器，并获取其位置信息
    query.exec(function(rects) {
      rects[0].forEach(function(rect) {
        if (rect.top > -rect.height + 12 && rect.top <= 20) {
          var childId = parseInt(rect.id[5]); // 获取滑动到的子元素的 ID 信息

          that.setData({
            slideIndex:childId
          })
        }
      });
    });
  }
});
