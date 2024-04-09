const {
  getChapterInfo,
} = require('../../services/chapterInfo');
const {
    getComicInfoBody,
  } = require('../../services/bookDetails');
const {
  throttle
} = require('../../utils/function-utils');

Page({
  timer_auto: null,
  timer_stop:null,
  /**
   * 页面的初始数据
   */
  data: {
    chapterInfo: null,
    chapterList: [],
    imageViewsList: [],
    chapterIndex: 0,
    hasReadChapterList: [],
    isShowMenu: false,
    isShowCatalogue: false,
    targetCatalogueId: '',
    windowHeight:0,
    scrollDistance:0,
    currentDistance:0,
    isAutoScroll:false,
    isScrolling: false,
    tapX:0,
    tapY:0,
    movableX: 0,
    speed:25,
    currentValue: 25,
    isCollected:false,
  },

  onDrag(event) {
    this.setData({
      currentValue:event.detail.value,
      speed: event.detail.value,
    });
  },

  onChange(event) {
    wx.showToast({
      icon: 'none',
      title: `自动速度：${event.detail}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    const { comicId, chapterNewid } = params;
    const self = this;
    console.log(chapterNewid)
    Promise.all([getChapterInfo(comicId, chapterNewid, 'high'), getComicInfoBody(comicId)])
      .then(result => {
        const currentChapter = {
          chapterId: result[0].current_chapter.chapter_id,
          chapterImgList: result[0].current_chapter.chapter_img_list
        };
        console.log(result[1]);
        const chatpterlist = result[1].comic_chapter.reverse();

        self.setData({
          chapterInfo: result[0],
          chapterList: chatpterlist,
          imageViewsList: [...self.data.imageViewsList, currentChapter],
          windowHeight:getApp().globalData.windowHeight,
          chapterIndex:chatpterlist.findIndex(item => item.chapter_id === chapterNewid),
        });
      });

    var collectionlist = '';

    if (wx.getStorageSync('collectionlist') != ''){
      collectionlist = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
      if (collectionlist.get(parseInt(comicId)) != undefined){
        self.setData({
          isCollected:true
        })
      }
    }
      // 调用监听器，监听数据变化
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  scrollToLowerHandle: function(event){
    clearInterval(this.timer_auto)
    this.timer_auto = null
    // console.log(event)
    this.setData({ isShowMenu: false });
    this.showMenuHandle()
  },

  showMenuHandle: function () {
    // console.log("show");
    const isShowMenu = this.data.isShowMenu;
    this.setData({ isShowMenu: !isShowMenu });
    wx.setNavigationBarColor({
      frontColor: !isShowMenu ? '#000000' : '#ffffff',
      backgroundColor: '#ffffff'
    });
  },

  showSideCatalogueHandle: function () {
    this.setData({
      isShowMenu: false,
      isShowCatalogue: true
    });
  },

  closeSideCatalogueHandle: function () {
    this.setData({ isShowCatalogue: false });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    });
  },

  returnUpLevelHandle: function () {
    var target_chapterid = this.data.chapterInfo.current_chapter.chapter_newid
    var target_comicid = this.data.chapterInfo.comic_id
    var historylist = new Map()

    if (wx.getStorageSync('historylist') != ''){
      historylist = new Map(JSON.parse(wx.getStorageSync('historylist')));
    }

    historylist.set(target_comicid,{
        comicId:target_comicid,
        target_chapterid:target_chapterid,
        comic_name:this.data.chapterInfo.comic_name,
        content:this.data.chapterInfo.current_chapter.chapter_name,
        touch_select:false,
        select_image:"/static/images/bookshelf/comic-icon-unselected.png"
    })
    var mapStr = JSON.stringify(Array.from(historylist.entries()));

    wx.setStorageSync('historylist', mapStr)

    if (this.timer != null){
      clearInterval(this.timer)
      this.timer = null
    }

    wx.navigateBack({
      delta: 1,
      success: function() {
        console.log('返回上一个页面成功');
      },
      fail: function(err) {
        console.error('返回上一个页面失败', err);
      }
    });
  },

  onPopupOpened() {
    var now = this.data.chapterInfo.current_chapter.chapter_id
    // 在这里设置 targetCatalogueId 的值为目标子元素的 id
    this.setData({
      targetCatalogueId: now
    });
  },

  scrollDown: function(event) {
    if (event != undefined){
      this.setData({
        isAutoScroll:!this.data.isAutoScroll
      })
    }

    if (!this.data.isAutoScroll){
      clearInterval(this.timer_auto)
      this.timer_auto = null
      this.setData({
        speed:25,
      })
    }else{
      const interval = 100; // 滚动频率，可根据需要调整
      this.timer_auto = setInterval(() => {
          let scrollTop = this.data.currentDistance
          scrollTop += this.data.speed; // 每次滚动的距离
          this.setData({
            currentDistance:scrollTop,
            scrollDistance:scrollTop
          })
      }, interval);
    }
  },

  handleScroll(event) {
    // console.log("scroll:" + event.detail.scrollTop)
    if (this.data.isScrolling){
    //    console.log("scroll")
      if (this.timer_stop != null){
        clearTimeout(this.timer_stop);
        this.timer_stop = null
      }
      // 创建新的定时器，在 50ms 后判断滚动停止
      this.timer_stop = setTimeout(() => {
        // console.log("stop-scroll:" + event.detail.scrollTop)
        this.setData({
          currentDistance: event.detail.scrollTop,
        });
        // 在滚动停止后执行需要的操作
      }, 50);
      // 将定时器保存到 data 中
    }else if (this.timer_stop != null){
      clearTimeout(this.timer_stop)
      this.timer_stop = null

      if (this.timer_auto != null){
        // console.log("clear_auto")
        clearInterval(this.timer_auto)
      }

      // 创建新的定时器，在 500ms 后判断滚动停止
      this.timer_stop = setTimeout(() => {
        // 在滚动停止后执行需要的操作
        // console.log("stop-scroll:" + event.detail.scrollTop)
        this.setData({
          currentDistance: event.detail.scrollTop,
        });
        this.scrollDown()
        this.timer_stop = null
      }, 500);
    }  
  },

  onScrollViewTouchStart(event) {
    clearInterval(this.timer_auto)
    this.timer_auto = null
    // 处理触摸开始事件
    this.setData({
      isScrolling:true,
      tapX:event.changedTouches[0].pageX,
      tapY:event.changedTouches[0].pageY,
    })
  },

  onScrollViewTouchEnd(event) {
    // 处理触摸结束事件
    var now_x = event.changedTouches[0].pageX;
    var now_y = event.changedTouches[0].pageY;
    if (now_x === this.data.tapX && now_y === this.data.tapY) {
      // 执行点击操作
      this.setData({
        isScrolling:false
      })
      
      if (now_x > 120 && now_x < 200 && now_y > 68 && now_y < 500){
        this.showMenuHandle();
      }else{
        var distance = this.data.currentDistance;
        if (now_y < 284){
          distance = distance > 100 ? distance - 100 : 0 
        }else{
          distance += 100
        }
        this.setData({
          isShowMenu:false,
          currentDistance:distance,
          scrollDistance:distance
        })
      }
      
      if (this.data.isAutoScroll)
        this.scrollDown()
    }else{
      this.setData({
        isScrolling:false
      })
      if (this.data.isAutoScroll){
        this.scrollDown()
      }
    }
  },

  pageUp: throttle(function () {
    const comicId = this.data.chapterInfo.comic_id;
    const chapterList = this.data.chapterList;
    const nextChapterIndex = this.data.chapterIndex - 1;
    const self = this;
    getChapterInfo(comicId, chapterList[nextChapterIndex].chapter_newid, 'high')
      .then(chapterInfo => {
        const currentChapter = {
          chapterId: chapterInfo.current_chapter.chapter_id,
          chapterImgList: chapterInfo.current_chapter.chapter_img_list
        };
        self.setData({
          chapterInfo: chapterInfo,
          chapterIndex: nextChapterIndex,
          imageViewsList: [currentChapter],
          currentDistance:0,
          scrollDistance:0
        });
      });
  }, 500),

  pageDown: throttle(function () {
    const comicId = this.data.chapterInfo.comic_id;
    const chapterList = this.data.chapterList;
    const nextChapterIndex = this.data.chapterIndex + 1;
    const self = this;
    getChapterInfo(comicId, chapterList[nextChapterIndex].chapter_newid, 'high')
      .then(chapterInfo => {
        const currentChapter = {
          chapterId: chapterInfo.current_chapter.chapter_id,
          chapterImgList: chapterInfo.current_chapter.chapter_img_list
        };
        self.setData({
          chapterInfo: chapterInfo,
          chapterIndex: nextChapterIndex,
          imageViewsList: [currentChapter],
          currentDistance:0,
          scrollDistance:0
        });
      });
  }, 500),

  collect:function(){
    const comicId = parseInt(this.data.chapterInfo.comic_id);
    const chapter = this.data.chapterInfo.current_chapter
    var collectionlist = new Map();
    var isCollected = this.data.isCollected

    var target = {
        comicId:comicId,
        target_chapterid:chapter.chapter_id,
        comic_name:this.data.chapterInfo.comic_name,
        content:chapter.chapter_name,
        touch_select:false,
        select_image:"/static/images/bookshelf/comic-icon-unselected.png"
    }

    
    if (wx.getStorageSync('collectionlist') != ''){
      collectionlist = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
      if (collectionlist.get(parseInt(comicId)) != undefined){
        collectionlist.delete(comicId)
      }else{
        collectionlist.set(comicId, target)
      }
    }else{
      collectionlist.set(comicId, target)
    }    
    var mapStr = JSON.stringify(Array.from(collectionlist.entries()));
    wx.setStorageSync('collectionlist', mapStr)

    this.setData({
      isCollected:!isCollected
    })
  }
});

