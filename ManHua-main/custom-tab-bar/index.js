Component({
  /**
   * 组件的初始数据
   */
  data: {
    selected: -1,
    list: [
      {
        pagePath: '/pages/find/find',
        iconPath: '../static/images/tabBar/icon_rank_unselection.png',
        selectedIconPath: '../static/images/tabBar/icon_rank_selection.png',
        text: '搜索'
      },
      {
        pagePath: '/pages/toUpdate/toUpdate',
        iconPath: '../static/images/tabBar/icon_updata_unselection.png',
        selectedIconPath: '../static/images/tabBar/icon_updata_selection.png',
        text: '更新'
      },
      {
        pagePath: '/pages/home/home',
        iconPath: '../static/images/tabBar/icon_home_selection.png',
        selectedIconPath: '../static/images/tabBar/icon_home_selection.png',
        text: '首页'
      },
      {
        pagePath: '/pages/bookShelf/bookShelf',
        iconPath: '../static/images/tabBar/icon_bookshelf_unselected.png',
        selectedIconPath: '../static/images/tabBar/icon_bookshelf_selection.png',
        text: '书架'
      },
      {
        pagePath: '/pages/myself/myself',
        iconPath: '../static/images/tabBar/icon_mine_unselection.png',
        selectedIconPath: '../static/images/tabBar/icon_mine_selection.png',
        text: '我的'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab (e) {
      //console.log(e.currentTarget.dataset.path)
      const data = e.currentTarget.dataset;
      wx.switchTab({ url: data.path });
    }
  }
});
