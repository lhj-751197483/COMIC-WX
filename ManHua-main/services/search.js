/**
 * GET | Object 获取热门搜索的主体信息
 * @param {String} url        Api接口地址
 * @param {Function} success  调用成功的回调函数
 * @param {Function} fail     调用失败的回调函数
 */
const getTopSearch = () => new Promise((resolve, reject) => {
	wx.request({
		url: getApp().globalData.topSearchApi,
		method: 'GET',
		dataType: 'json',
		data: {
			platformname: 'android',
			productname: 'kmh',
		},
		success: result => {resolve(result.data)},
		fail: error => reject(error)
	});
});

const getSearch = (search_key) => new Promise((resolve, reject) => {
	wx.request({
		url: getApp().globalData.comicInfoSearchApi,
		method: 'GET',
		dataType: 'json',
		data: {
			product_id:1,
			platformname: 'android',
			productname: 'kmh',
			search_key:search_key
		},
		success: result => {resolve(result.data)},
		fail: error => reject(error)
	});
});

module.exports = {
	getTopSearch,
	getSearch
  };