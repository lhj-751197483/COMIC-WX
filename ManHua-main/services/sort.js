/**
 * GET | LIST 获取分类列表
 * @param {String} sort_type 分类的类型
 * @param {String} orderby   排行的类型
 * @param {Number} page      页码
 * @param {Function} success  调用成功的回调函数
 * @param {Function} fail     调用失败的回调函数
 */
const getSortList = (comic_sort, orderby, page) => new Promise((resolve, reject) => {
    wx.request({
      url: getApp().globalData.sortApi,
      method: 'GET',
      dataType: 'json',
      data: {
        platform:6,
        productname: 'kmh',
        platformname: 'weixin_applet',
        productId: 1,
        platformId:6,
        clienttype:'weixin_applet',
        comic_sort,
        orderby,
        page,
        size:15,
      },
      success: result => {
        // console.log(result)
        resolve(result.data.data);
      },
      fail: error => reject(error)
    });
});

exports.getSortList = getSortList;