const {
  getComicInfoBody,
  getComicInfoRole,
  getComicInfoInfluence
} = require('../../services/bookDetails');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    comicId: 0,
    comicDetails: {},
    comicRole: [],
    comicInfluence: {},
    isHideLoading: false,
    isShowInfluence: false,
    desc_line_clamp: 2,
    isShowCatalogue:false,
    windowHeight:0,
    targetElementId:'',
    isCollected:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (params) {
    const { comicId } = params;
    const self = this;
    Promise.all([getComicInfoBody(comicId), getComicInfoRole(comicId), getComicInfoInfluence(comicId)])
      .then(res => {
        res[0].comic_chapter.reverse()
        self.setData({
          comicId: comicId,
          comicDetails: res[0],
          comicRole: res[1],
          comicInfluence: res[2],
          windowHeight:getApp().globalData.windowHeight * 750 / getApp().globalData.windowWidth,
        });
        // console.log(comicId)
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
    setTimeout(function () {
        var collectionlist = '';
        const comicId = self.data.comicId
        if (wx.getStorageSync('collectionlist') != ''){
            collectionlist = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
            if (collectionlist.get(parseInt(comicId)) != undefined){
                self.setData({
                    isCollected:true
                })
            }else{
                self.setData({
                    isCollected:false
                })
            }
        }
        self.setData({
            isHideLoading:true,
        })
    }, 250)
  },

  onShow:function(){
    const self = this;
   
    var collectionlist = '';
    const comicId = self.data.comicId
    if (wx.getStorageSync('collectionlist') != ''){
        collectionlist = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
        if (collectionlist.get(parseInt(comicId)) != undefined){
            self.setData({
                isCollected:true
            })
        }else{
            self.setData({
                isCollected:false
            })
        }
    }
  },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        this.setData({isShowCatalogue:false});
    },

  startReadingHandle: function (e) {
    const comicId = this.data.comicId;
    var historylist = '';
    const chapter = this.data.comicDetails.comic_chapter
    var target = chapter[0].chapter_id

    if (wx.getStorageSync('historylist') != ''){
      historylist = new Map(JSON.parse(wx.getStorageSync('historylist')));
      if (historylist.get(parseInt(comicId)) != undefined)
        target = historylist.get(parseInt(comicId)).target_chapterid
    }

    
    if (e.currentTarget.dataset.nowid != undefined){
      target = e.currentTarget.dataset.nowid
    }

    wx.navigateTo({
      url: `/pages/chapterRead/chapterRead?comicId=${comicId}&chapterNewid=${target}`
    });
  },

  showInfluenceHandle: function () {
    this.setData({ isShowInfluence: !this.data.isShowInfluence });
  },

  returnUpLevelHandle: function () {
    
    wx.navigateBack({
      delta: 1
    });
  },

  expand_text:function(){
    var desc = Object(this.data.comicDetails.comic_desc)
    var length = desc.length
    var show_length = length / 25 + 1
    var now_length = this.data.desc_line_clamp

    if (now_length == 2){
      this.setData({
        desc_line_clamp:show_length
      })
    }else{
      this.setData({
        desc_line_clamp:2
      })
    }
  },

  showSideCatalogueHandle: function () {
    this.setData({
      isShowCatalogue: true
    });
  },

  closeSideCatalogueHandle: function () {
    this.setData({ 
      isShowCatalogue: false 
    });
  },

  onPopupOpened() {
    const comicId = this.data.comicId;
    var historylist = '';
    const chapter = this.data.comicDetails.comic_chapter
    var target = chapter[0].chapter_id

    if (wx.getStorageSync('historylist') != ''){
      historylist = new Map(JSON.parse(wx.getStorageSync('historylist')));
      if (historylist.get(parseInt(comicId)) != undefined)
        target = historylist.get(parseInt(comicId)).target_chapterid
    }
    // 在这里设置 targetElementId 的值为目标子元素的 id
    this.setData({
      targetElementId: target
    });
  },

  onCollectbtn(){
    const comicId = parseInt(this.data.comicId);
    var historylist = '';
    const chapter = this.data.comicDetails.comic_chapter[0]
    var collectionlist = new Map();
    var isCollected = this.data.isCollected

    var target = {
        comicId:comicId,
        target_chapterid:chapter.chapter_id,
        comic_name:this.data.comicDetails.comic_name,
        content:chapter.chapter_name,
        touch_select:false,
        select_image:"/static/images/bookshelf/comic-icon-unselected.png"
    }

    if (wx.getStorageSync('historylist') != ''){
      historylist = new Map(JSON.parse(wx.getStorageSync('historylist')));
      if (historylist.get(parseInt(comicId)) != undefined)
        target = historylist.get(parseInt(comicId))     
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
    // console.log(collectionlist)
    var mapStr = JSON.stringify(Array.from(collectionlist.entries()));
    wx.setStorageSync('collectionlist', mapStr)

    this.setData({
      isCollected:!isCollected
    })
  }
});
