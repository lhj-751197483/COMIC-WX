// pages/find/find.js
const app = getApp();
const { getTopSearch, getSearch } = require('../../services/search');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '', // 搜索框文本
    searchResults: [], // 搜索结果
    searchHistory: [],
    showClearIcon: false,
    showSearchResults: false,
    topDistance: app.globalData.statusBarHeight,
    windowHeight: 0,
    hotSearch:[] // 热门搜索信息
  },

 // 搜索框输入事件
 onSearchInput(event) {
  this.setData({
    searchText: event.detail.value,
    showClearIcon:event.detail.value !== '',
  });
},

  onSearch: function (event) {
    // console.log(event.detail.value)
    const keyword = event.detail.value.trim();
    const self = this;

    if (keyword === '') {
      wx.showToast({ title: '搜索漫画名', icon: 'none' });
      this.setData({
        showSearchResults:false
      });
      return;
    }

    // 更新搜索记录
    let searchHistory = this.data.searchHistory;
    if (searchHistory.indexOf(keyword) === -1) {
      searchHistory.unshift(keyword);
      searchHistory = searchHistory.slice(0, 10); // 控制搜索记录的数量，这里假设最多显示5条记录
      this.setData({ searchHistory });
      wx.setStorageSync('searchHistory', searchHistory);
    }else{
      let index = searchHistory.indexOf(keyword);
      let temp = searchHistory[0];
      searchHistory[0] = searchHistory[index];
      searchHistory[index] = temp;
      this.setData({ searchHistory });
      wx.setStorageSync('searchHistory', searchHistory);
    }
    
    getSearch(keyword).then(result => {
      // console.log(result)
      self.setData({
        searchResults:result.data,
        showSearchResults:true
      })
    });
    // 执行搜索操作
    console.log('搜索关键字：' + keyword);
  },

  // 点击热门搜索关键词
  onKeywordTap(event) {
    const keyword = event.currentTarget.dataset.keyword;
    console.log(keyword)
    // 更新搜索记录
    let searchHistory = this.data.searchHistory;
    if (searchHistory.indexOf(keyword.comic_name) === -1) {
      searchHistory.unshift(keyword.comic_name);
      searchHistory = searchHistory.slice(0, 10); // 控制搜索记录的数量，这里假设最多显示5条记录
      this.setData({ searchHistory });
      wx.setStorageSync('searchHistory', searchHistory);
    }else{
      let index = searchHistory.indexOf(keyword.comic_name);
      let temp = searchHistory[0];
      searchHistory[0] = searchHistory[index];
      searchHistory[index] = temp;
      this.setData({ searchHistory });
      wx.setStorageSync('searchHistory', searchHistory);
    }
    // 将关键词填入搜索框
    wx.navigateTo({
      url: '/pages/bookDetails/bookDetails?comicId=' + keyword.comic_id,
    })
    // 执行搜索
  },

  clearInput: function () {
    console.log("1")
    this.setData({
      searchText: '',
      searchResults: [],
      showClearIcon: false,
      showSearchResults: false
    });
  },

  clearHistory: function () {
    wx.removeStorageSync('searchHistory');
    this.setData({ searchHistory: [] });
  },

  selectSearchHistory: function (event) {
    const keyword = event.currentTarget.dataset.keyword;
    const self = this;

    getSearch(keyword).then(result => {
      self.setData({
        searchResults:result.data
      })
    });

    this.setData({
      searchText: keyword,
      showClearIcon: true,
      showSearchResults:true
    });
  },

  selectSearchResult: function(event){
    const comicId = event.currentTarget.dataset.comicid;
    // 将关键词填入搜索框
    wx.navigateTo({
      url: '/pages/bookDetails/bookDetails?comicId=' + comicId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const self = this
    const searchHistory = wx.getStorageSync('searchHistory') || [];
    const windowHeight = app.globalData.windowHeight - app.globalData.statusBarHeight - 30 - app.globalData.windowWidth / 750 * 270

    this.setData({ searchHistory });
    getTopSearch().then(result => {
      self.setData({
        hotSearch:result.data,
        windowHeight:windowHeight
      })
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
    //添加选中效果
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      //自定义组件的getTabBar 方法，可获取当前页面下的自定义 tabBar 组件实例。
      this.getTabBar().setData({
        selected: 0 //这个是tabBar中当前页对应的下标
      });
    }
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