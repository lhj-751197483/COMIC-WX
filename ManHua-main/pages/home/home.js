const { throttle } = require('../../utils/function-utils');
const { getRecommendList } = require('../../services/recommend');

const app = getApp();

const MAX_PAGE_NUMBER = 4;

Page({
  data: {
    coverHost: app.globalData.pathRules.book_cover_comic,
    slideList: [],
    comicList: [],
    curPageNum: 1,
    bookType: 132,
    isHidWait: false,
    isHidRefresh: true,
    isNoMore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const self = this;
    const bookType = this.data.bookType;
    // 选择图片文件并获取临时文件路径

    getRecommendList(1, bookType).then(comicList => {
      const slideInfo = comicList.splice(0, 1)[0].comic_info;
      const slideList = slideInfo.map(item => {
        const comicId = item.comic_id;
        const imgUrl = item.img_url;
        return { comicId, imgUrl };
      });
      self.setData({ slideList, comicList, isHidWait: true });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 添加选中效果
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      // 自定义组件的getTabBar 方法，可获取当前页面下的自定义 tabBar 组件实例。
      this.getTabBar().setData({
        selected: 2 // 这个是tabBar中当前页对应的下标
      });
    }
  },


  scrollToLowerHandle: throttle(function () {
    const self = this;
    let curPageNum = this.data.curPageNum;
    const comicList = this.data.comicList;
    const bookType = this.data.bookType;
    
    if (curPageNum < MAX_PAGE_NUMBER) {
      // 显示 Loading
      self.setData({
        isNoMore: false,
        isHidRefresh: false
      });

      // 请求数据，并添加至 comicList
      getRecommendList(curPageNum + 1, bookType).then(result => {
        comicList.push(...result);
        curPageNum = curPageNum + 1;
        //console.log(result)
        self.setData({ comicList, curPageNum });
      });
    } else {
      // 显示 底部 Tip
      this.setData({
        isNoMore: true,
        isHidRefresh: false
      });
    }
  }, 500),

  gotoBookDetail:function(e){
    var comicId = e.currentTarget.dataset.comicid
    //console.log(comicId)
    wx.navigateTo({
      url: '/pages/bookDetails/bookDetails?comicId=' + comicId,
      success: () => {
      },
      fail: (res) => {
        console.log(res)
      },
    })
  },

  gotoComicList:function(e){
    var comicList = e.currentTarget.dataset.comiclist;
    var comic_info = comicList.comic_info;
    var comic_title = comicList.title;
    comic_info = JSON.stringify(comic_info)
    wx.navigateTo({
      url: '/pages/comicList/comicList?comic_info=' + comic_info + "&comic_title=" + comic_title,
      success: (res) => {
      },
      fail: (res) => {
        console.log(res)
      },
    })
  },

  refreshComicList:function(e){
        var index = e.currentTarget.dataset.comicindex;
        var comiclist = this.data.comicList;
        var comicinfo = comiclist[index].comic_info;
        var temp = comicinfo.splice(0, 6);
        for (var i = 0; i < temp.length; i++){
            comicinfo.push(temp[i]);
        }
        
        this.setData({
            comicList:comiclist
        })
  }
});
