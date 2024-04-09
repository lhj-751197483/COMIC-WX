/**
 * GET | LIST  获取全部分类列表
 * @param {Function} success  调用成功的回调函数
 * @param {Function} fail     调用失败的回调函数
 */
const getAllClassify = () => new Promise((resolve, reject) => {
    wx.request({
      url: getApp().globalData.allClassifyApi,
      method: 'GET',
      dataType: 'json',
      data: {
        platform:6,
        productname: 'kmh',
        platformname: 'weixin_applet',
        productId: 1,
        platformId:6,
        clienttype:'weixin_applet',
      },
      success: result => {
        // console.log(result)
        resolve(result.data.data);
      },
      fail: error => reject(error)
    });
});
  
exports.getAllClassify = getAllClassify;