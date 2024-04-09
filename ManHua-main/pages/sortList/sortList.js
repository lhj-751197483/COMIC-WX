// pages/sortList/sortList.js
const { getSortList } = require('../../services/sort');
const { throttle } = require('../../utils/function-utils');

const MAX_PAGE_NUMBER = 30;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        category:null,
        category_class:[{ name:'最热', newid:'click', comicList:[] }, 
                        { name:'最新', newid:'date', comicList:[]}, 
                        {name:'口碑', newid:'score', comicList:[]}],
        currentIndex: 0, // 当前选中的分类索引
        scrollTop:0,
        isHidRefresh: true,
        isNoMore: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(params) {
        const category = JSON.parse(params.category);
        const self = this;
        const category_class = this.data.category_class

        for (let i = 0; i < 3; i++){
            const rank = category_class[i].newid;

            getSortList(category.newid, rank, 1).then(result => {
                let index = category_class.findIndex(item => item.newid === rank);
                category_class[index].comicList = {comic: result.data, curPageNum: 1};

                self.setData({
                    category_class,
                })
            })
        }

        this.setData({
            category
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

    selectCategory: function(e) {
        const index = e.currentTarget.dataset.index;
        this.setData({ currentIndex: index });
    },

    swiperChange: function(e) {
        if (e != null){
            const currentIndex = e.detail.current; // 获取当前swiper的索引
            const query = wx.createSelectorQuery().in(this); // 创建选择器查询对象
            const item = this.data.category_class[currentIndex].newid; // 获取当前swiper的scroll的id

            // console.log(item)
            query.select('#' + item).node(function(res){
                // console.log(res)
                res.node.scrollTo({
                    top: 0, 
                    animated: true, 
                    duration: 100
                })
            }).exec()

            this.setData({
                currentIndex: currentIndex,
            });
        }
    },

    returnUpLevelHandle: function () {
        wx.navigateBack({
          delta: 1
        });
    },

    scrollToLowerHandle: throttle(function (e) {
        const self = this;
        const index = e[0].currentTarget.dataset.index;
        const comiclist = this.data.category_class[index].comicList;
        const rank = this.data.category_class.newid;
        const category = this.data.category.newid;
        
        let curPageNum = comiclist.curPageNum + 1;

        if (curPageNum < MAX_PAGE_NUMBER && comiclist.comic.length >= 15) {
          // 显示 Loading
          self.setData({
            isNoMore: false,
            isHidRefresh: false
          });

          // 请求数据，并添加至 comicList
          getSortList(category, rank, curPageNum).then(result => {
            let comicList = comiclist;
            let category_class = self.data.category_class;

            comicList.comic.push(...result.data);

            if (result.data.length < 15){
                comicList.curPageNum = MAX_PAGE_NUMBER;
            }else{
                comicList.curPageNum = curPageNum;
            }
            
            category_class[index].comicList = comicList;

            self.setData({
                category_class,
            })
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
        
        wx.navigateTo({
          url: '/pages/bookDetails/bookDetails?comicId=' + comicId,
          success: () => {
          },
          fail: (res) => {
            console.log(res)
          },
        })
    },
})