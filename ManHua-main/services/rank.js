/**
 * GET | LIST 获取排行榜列表
 *  @param {Number} sort_type 排行榜的类型
 *  @param {Number} page      页码
 * @param {Function} success  调用成功的回调函数
 * @param {Function} fail     调用失败的回调函数
 */
const getRankList = (sort_type, page) => new Promise((resolve, reject) => {
    wx.request({
      url: getApp().globalData.rankApi,
      method: 'GET',
      dataType: 'json',
      data: {
        platform:6,
        productname: 'kmh',
        platformname: 'weixin_applet',
        productId: 1,
        platformId:6,
        clienttype:'weixin_applet',
        isalldata:0,
        sort_type,
        rank_type:'heat',
        time_type:'week',
        page,
        pageSize:20,
        pytype: 'tuijian', // 推荐的拼音
      },
      success: result => {
        // console.log(result)
        resolve(result.data.data);
      },
      fail: error => reject(error)
    });
});

exports.getRankList = getRankList;
  