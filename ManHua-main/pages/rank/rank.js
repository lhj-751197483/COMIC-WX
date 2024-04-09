// pages/rank/rank.js
const { getRankList } = require('../../services/rank');
const { throttle } = require('../../utils/function-utils');

const MAX_PAGE_NUMBER = 6;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        categories: [{ name: '综合榜', backgroundColor: '', sort_type:'all'}, // 默认背景色为空    
            { name: '自制榜', backgroundColor: '', sort_type:'self'},
            { name: '少年榜', backgroundColor: '', sort_type:'boy'},
            { name: '少女榜', backgroundColor: '', sort_type:'girl'},
            { name: '新作榜', backgroundColor: '', sort_type:'new'},
            { name: '黑马榜', backgroundColor: '', sort_type:'dark'},
            { name: '收费榜', backgroundColor: '', sort_type:'charge'},
            { name: '免费榜', backgroundColor: '', sort_type:'free'},
            { name: '完结榜', backgroundColor: '', sort_type:'finish'},
            { name: '连载榜', backgroundColor: '', sort_type:'serialize'},
            { name: '月票榜', backgroundColor: '', sort_type:'all'},
            { name: '评分榜', backgroundColor: '', sort_type:'all'},
        ], // 侧边导航栏的分类
        currentIndex: 0, // 当前选中的分类索引
        scrollTopId: 'category0', // scroll-view的scroll-into-view属性值，用于定位到对应的分类项
        topComicId:0,
        windowHeight:0,
        windowWidth:0,
        curPageNum:1,
        sort_type:'new',
        scrollTop:'',
        isHidRefresh: true,
        isNoMore: false,
        sideHeight:0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        // 在页面加载时加载漫画排行榜数据
        this.loadComicList();
        this.setData({
            windowHeight:getApp().globalData.windowHeight,
            windowWidth:getApp().globalData.windowWidth
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    loadComicList: function () {
        // 这里模拟加载漫画排行榜数据
        // 实际项目中可能需要调用后端接口获取数据
        const self = this;
        const sort_type = this.data.sort_type;
        const curPageNum = this.data.curPageNum;
        // 更新页面数据
        getRankList(sort_type, curPageNum).then(result => {
            self.setData({
                comicList:result.list,
                topComicId:result.list[0].comic_id,
            })
        });
    },

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

    sidebarPosition(event) {
        // console.log(event.detail.scrollTop)
        this.setData({
            sideHeight:event.detail.scrollTop > 250 ? 250 : event.detail.scrollTop
        })
    },

    scrollToLowerHandle: throttle(function () {
        const self = this;
        let curPageNum = this.data.curPageNum;
        const comicList = this.data.comicList;
        const sort_type = this.data.sort_type;
        
        if (curPageNum < MAX_PAGE_NUMBER) {
          // 显示 Loading
          self.setData({
            isNoMore: false,
            isHidRefresh: false
          });

          // 请求数据，并添加至 comicList
          getRankList(sort_type, curPageNum + 1).then(result => {
            const list = result.list;
            comicList.push(...list);
            let uniqueList = Array.from(new Set(comicList.map(JSON.stringify))).map(JSON.parse);

            curPageNum = curPageNum + 1;
            self.setData({ comicList: uniqueList, curPageNum });
          });
        } else {
          // 显示 底部 Tip
          this.setData({
            isNoMore: true,
            isHidRefresh: false
          });
        }
      }, 500),    

      // 切换分类
    switchCategory(event) {
        const index = event.currentTarget.dataset.index;
        const categories = this.data.categories.map((item, idx) => {
            if (idx === index) {
                // 生成浅色随机颜色
                const randomColor = this.getRandomLightColor();
                return { name: item.name, backgroundColor: randomColor, sort_type: item.sort_type};
            } else {
                item.backgroundColor=''
                return item;
            }
        });

        const sort_type = categories[index].sort_type;
        const now_type = this.data.sort_type;

        this.setData({
            comic_scroll:false,
            scrollTop:"head",
        })

        this.setData({
            currentIndex: index,
            scrollTopId: 'category' + index,
            categories: categories
        });

        if (sort_type != now_type){
            this.handleSidebarTap(sort_type);
        }
    },

    getRandomLightColor() {
        const letters = 'ACE'.split('');
        let color = '#';

        do {
            for (let i = 0; i < 3; i++) {
                color += letters[Math.floor(Math.random() * letters.length)];
        }}while(this.isWhiteColor(color));

        return color;
    },

    isWhiteColor(color) {
        return /^#([a-zA-Z])\1\1$/i.test(color);
    },

    
    // 处理侧边导航栏点击事件
    handleSidebarTap: function (sort_type) {     
        // 根据点击的分类刷新漫画排行榜数据
        this.setData({
            sort_type,
            curPageNum: 1,
        })

        this.loadComicList();
    },

    returnUpLevelHandle: function () {
    
        wx.navigateBack({
          delta: 1
        });
    },
})