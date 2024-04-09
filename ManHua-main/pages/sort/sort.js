// pages/sort/sort.js
const { getSortList } = require('../../services/sort');
const { getAllClassify } =  require('../../services/allClassify');
const { throttle } = require('../../utils/function-utils');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        categories: [],
        sortList:[],
        isHidRefresh: true,
        isNoMore: false,
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        const self = this;
        getAllClassify().then(result => {
            let categories = result[3].children;
            let promiseArr = [];
        
            for (var i = 0; i < 5; i++) {
                const index = i;
                promiseArr.push(
                    getSortList(categories[index].newid, 'click', 1).then(result => {
                        return result.data;
                    })
                );
            }
        
            Promise.all(promiseArr).then(sortLists => {
                self.setData({
                    sortList: sortLists,
                    categories: categories
                });
            }).catch(err => {
                console.error('Error:', err);
            });
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    viewCategory: function(e) {
        const index = e.currentTarget.dataset.index;
        var category = this.data.categories[index];
        category = JSON.stringify(category)
        // 在这里编写查看分类的跳转逻辑，可以跳转到另一个页面来展示该分类的所有内容
        wx.navigateTo({
            url: '/pages/sortList/sortList?category=' + category,
            success: (res) => {
            },
            fail: (res) => {
            console.log(res)
            },
        })
    },

    scrollToLowerHandle: throttle(function () {
        const self = this;
        let curPageNum = this.data.sortList.length;
        const MAX_PAGE_NUMBER = this.data.categories.length;
        const categories = self.data.categories;
        let promiseArr = [];
        
        if (curPageNum < MAX_PAGE_NUMBER) {
          // 显示 Loading
          self.setData({
            isNoMore: false,
            isHidRefresh: false
          });

          const length = curPageNum + 5 > MAX_PAGE_NUMBER ? MAX_PAGE_NUMBER :  curPageNum + 5;
          // 请求数据，并添加至 comicList
          for (var i = curPageNum; i < length; i++){         
            const index = i;
            promiseArr.push(
                getSortList(categories[index].newid, 'click', 1).then(result => {
                    return result.data;
                })
            );
          }

          Promise.all(promiseArr).then(sortLists => {
                var result = self.data.sortList;
                for (let i = 0; i < sortLists.length; i++){
                    result.push(sortLists[i])
                }
                self.setData({
                    sortList: result,
                });
            }).catch(err => {
                console.error('Error:', err);
            });
        } else {
          // 显示 底部 Tip
          this.setData({
            isNoMore: true,
            isHidRefresh: false
          });
        }
      }, 300),    

    returnUpLevelHandle: function () {
    
        wx.navigateBack({
          delta: 1
        });
    },
})