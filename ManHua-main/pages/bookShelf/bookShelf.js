const app = getApp();

Page({
    data: {
        topDistance: app.globalData.statusBarHeight,
        pageRoute: "bookshelf/bookshelf",
        currentTab: "history",
        currentMode: "normal",
        allSelected: !1,
        noSelected: !0,
        hasHistory: !1,
        collectionComic:[],
        historyComic:[],
        hasUserInfo:false,
    },
    

    onShareAppMessage: function() {

    },
    
    onUnload: function() {

    },

    onLoad: function() {
        var historylist = '';
        var collectionlist = '';

        if (wx.getStorageSync('historylist').length > 2){
            historylist = new Map(JSON.parse(wx.getStorageSync('historylist')));
            this.setData({
                historyComic:[...historylist.values()],
                hasHistory:!0
            })
        }

        if(wx.getStorageSync('collectionlist').length > 2){
            collectionlist = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
            this.setData({
                collectionComic:[...collectionlist.values()]
            })
        }
    },

    onShow: function(e) {
        var historylist = '';
        var collectionlist = ''; 

        if (wx.getStorageSync('openid') != ''){
            this.setData({
              hasUserInfo: true
            })
        }else{
            this.setData({
                hasUserInfo: false
            })
        }

        if (wx.getStorageSync('historylist').length > 2){
            historylist = new Map(JSON.parse(wx.getStorageSync('historylist')));
            this.setData({
                historyComic:[...historylist.values()],
                hasHistory:!0
            })
        }

        if(wx.getStorageSync('collectionlist').length > 2){
            collectionlist = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
            this.setData({
                collectionComic:[...collectionlist.values()]
            })
        }

        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            // 自定义组件的getTabBar 方法，可获取当前页面下的自定义 tabBar 组件实例。
            this.getTabBar().setData({
              selected: 3 // 这个是tabBar中当前页对应的下标
            });
        }
    },
 
    login: function() {
        const self = this
        // 处理登录逻辑
        // console.log(wx.getStorageSync('openid'))
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
                        hasUserInfo:true,
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

    getCurrentCtrl: function(e) {
       if (this.data.currentMode == 'select'){
            var comicid = e.currentTarget.dataset.comicid
            var mode = this.data.currentTab
            var comiclist = []
            var select = false
            var unselected_url = "/static/images/bookshelf/comic-icon-unselected.png"
            var selected_url = "/static/images/bookshelf/comic-icon-selected.png"
            var allselect = false

            if (mode == "history"){
                    comiclist = this.data.historyComic
            }else{
                    comiclist = this.data.collectionComic
            }
            
            var image = comiclist[comiclist.findIndex(item=>item.comicId == comicid)].select_image
            if (image == unselected_url){
                    comiclist[comiclist.findIndex(item=>item.comicId == comicid)].select_image = selected_url
            }else{
                    comiclist[comiclist.findIndex(item=>item.comicId == comicid)].select_image = unselected_url
            }

            if (comiclist.findIndex(item=>item.select_image == selected_url) != -1){
                select = true
            }

            if (comiclist.filter((e)=>e.select_image===selected_url).length == comiclist.length){
                allselect = true
            }

            if (mode == "history"){
                this.setData({
                    historyComic:comiclist,
                    noSelected:!select,
                    allSelected:allselect
                })
            }else{
                this.setData({
                    collectionComic:comiclist,
                    noSelected:!select,
                    allSelected:allselect
                })
            }
        }
    },

    checkAllSelected: function() {
        
    },

    _changeComicListMode: function() {
        var current = this.data.currentMode == 'select' ? 'normal':'select';
        var comiclist = []
        var mode = this.data.currentTab

        if (mode == "history"){
            comiclist = this.data.historyComic
        }else{
            comiclist = this.data.collectionComic
        }

        for (var i = 0; i < comiclist.length; i++){
            comiclist[i].select_image =  "/static/images/bookshelf/comic-icon-unselected.png"
        }

        if (this.data.currentTab == "history"){
            this.setData({
                historyComic:comiclist
            })
        }else{
            this.setData({
                collectionComic:comiclist
            })
        }

        this.setData({
          currentMode:current,
          noSelected:true
        })
    },

    _onTapTab: function(e) {
      var current = this.data.currentTab == 'history' ? 'collection':'history';
      this.setData({
        currentTab:current
      })
    },

    _toggleSelectAll: function() {
        
        var allselect = this.data.allSelected == !1 ? !0 : !1;

        var comiclist = []
        var mode = this.data.currentTab

        if (mode == "history"){
            comiclist = this.data.historyComic
        }else{
            comiclist = this.data.collectionComic
        }
        if (comiclist.length != 0){
            if (allselect){
                for (var i = 0; i < comiclist.length; i++){
                    comiclist[i].select_image =  "/static/images/bookshelf/comic-icon-selected.png"
                }
                this.setData({
                    noSelected:false
                })
            }else{
                for (var i = 0; i < comiclist.length; i++){
                    comiclist[i].select_image =  "/static/images/bookshelf/comic-icon-unselected.png"
                }
                this.setData({
                    noSelected:true
                })
            }

            if (this.data.currentTab == "history"){
                this.setData({
                    historyComic:comiclist
                })
            }else{
                this.setData({
                    collectionComic:comiclist
                })
            }
            
            this.setData({
                allSelected:allselect
            })
        }
    },

    _doDelete: function() {
        var comicStorage = '';
        var comiclist = []
        var mode = this.data.currentTab
        var selected_url = "/static/images/bookshelf/comic-icon-selected.png"

        
        if (mode == "history"){
            comiclist = this.data.historyComic
            if (comiclist.length != 0)
                comicStorage = new Map(JSON.parse(wx.getStorageSync('historylist')));
        }else{
            comiclist = this.data.collectionComic
            if (comiclist.length != 0)
                comicStorage = new Map(JSON.parse(wx.getStorageSync('collectionlist')));
        }

        if (comiclist.findIndex(item=>item.select_image == selected_url) != -1){

            for (var i = 0; i < comiclist.length; i++){
                if (comiclist[i].select_image == selected_url){
                    comicStorage.delete(parseInt(comiclist[i].comicId))
                    comiclist.splice(i, 1)
                    i--
                }
            }

            console.log(comicStorage)
            var mapStr = JSON.stringify(Array.from(comicStorage.entries()));

            if (mode == "history"){
                this.setData({
                    historyComic:comiclist,
                    noSelected:true
                })
                wx.setStorageSync('historylist', mapStr)
            }else{
                this.setData({
                    collectionComic:comiclist,
                    noSelected:true
                })
                wx.setStorageSync('collectionlist', mapStr)
            }

            if (comiclist.length == 0){
                this.setData({
                    allSelected:false
                })
            }
        }
    }
});