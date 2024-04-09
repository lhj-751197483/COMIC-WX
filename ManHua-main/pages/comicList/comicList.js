// pages/comicList/comicList.js
// const { throttle } = require('../../utils/function-utils');
const { getChapterList } = require('../../services/chapterInfo');
// const MAX_PAGE_NUMBER = 4;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        comic_info: [],
        comic_title:"",
        isHidRefresh: true,
        isNoMore: false,
        isHideLoading: false,
        chapterList:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(params) {
        const comic_info = JSON.parse(params.comic_info);
        const comic_title = params.comic_title;
        var collectionlist = '';
        

        if (wx.getStorageSync('collectionlist') != ''){
            collectionlist = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
            for (var i = 0; i < comic_info.length; i++){
                const comicId = comic_info[i].comic_id
                if (collectionlist.get(parseInt(comicId)) != undefined){
                    comic_info[i].url = true;
                }else{
                    comic_info[i].url = false;

                }
            }
        }

        this.setData({
            comic_info:comic_info,
            comic_title:comic_title,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        const self = this;

        setTimeout(function () {
          self.setData({ isHideLoading: true });
        }, 450);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(params) {
       
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

    returnUpLevelHandle: function () {
    
        wx.navigateBack({
          delta: 1
        });
    },
    
    scrollToLowerHandle: function () {   
        // 显示 底部 Tip
        this.setData({
        isNoMore: true,
        isHidRefresh: false
        });
    },

    gotoComic: function (e){
        const comicId = e.currentTarget.dataset.comicid
        const comicName = e.currentTarget.dataset.comic_name
        console.log(comicName)
        if (comicName == undefined){
            wx.navigateTo({
                url: '/pages/bookDetails/bookDetails?comicId=' + comicId,
            })
        }
    },

    onCollectbtn(e){
        const comicId = parseInt(e.currentTarget.dataset.comicid);
        const comicName = e.currentTarget.dataset.comic_name;
        const comicIndex = e.currentTarget.dataset.index;
        var collectionlist = new Map();
        var comic_info = this.data.comic_info;
        const self = this;

        getChapterList(comicId).then(result => {
            const chapterList = result.reverse()
             self.setData({
                chapterList
             })
        });

        setTimeout(function() {
            var chapter = self.data.chapterList[0];
            // console.log(chapter)

            var target = {
                comicId:comicId,
                target_chapterid:chapter.chapter_id,
                comic_name:comicName,
                content:chapter.chapter_name,
                touch_select:false,
                select_image:"/static/images/bookshelf/comic-icon-unselected.png"
            }
            
            if (wx.getStorageSync('collectionlist') != ''){
              collectionlist = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
              if (collectionlist.get(parseInt(comicId)) != undefined){
                collectionlist.delete(comicId)
                comic_info[comicIndex].url = false
              }else{
                collectionlist.set(comicId, target)
                comic_info[comicIndex].url = true;
              }
            }else{
              collectionlist.set(comicId, target)
              comic_info[comicIndex].url = true;
            }    

            var mapStr = JSON.stringify(Array.from(collectionlist.entries()));
            wx.setStorageSync('collectionlist', mapStr)
            

            self.setData({
                comic_info
            })
        }, 300)
    },
})