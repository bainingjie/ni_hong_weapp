// pages/payDelivery/index.ts
import type {main as getADelivery} from '../../../cloudfunctions/quickstartFunctions/getADelivery/index'
import type {main as getCouponForUser} from '../../../cloudfunctions/quickstartFunctions/getCouponForUser/index'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},
	main(id:DB.DocumentId){
		wx.showLoading({
			title: '',
		});
		wx.cloud.callFunction<typeof getADelivery>({
			name: 'quickstartFunctions',
			data: {
				type: 'getADelivery',
				_id: id
			}
		}).then((resp) => {
			console.assert('data' in resp.result);
			console.assert(Array.isArray(resp.result.data));
			console.assert(resp.result.data.length===1);

			wx.cloud.callFunction<typeof getCouponForUser>({
				name: 'quickstartFunctions',
				data:{
					type: 'getCouponForUser',
					open_id: resp.result.data[0].open_id
				}
			}).then((resp1)=>{
				const delivery = resp.result.data[0];
				const coupons = resp1.result;
				console.log(`user (user_id=${delivery.open_id})'s coupons=`);
				console.assert(coupons!==null);
				console.log(coupons);
				
				wx.hideLoading();
			})

		}).catch((e) => {
			console.log(e);
			wx.hideLoading();
		});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// console.log("onshow() called!");
		// 获取当前小程序的页面栈
		let pages = getCurrentPages();
		// 数组中索引最大的页面--当前页面
		// console.log(pages)	
		let currentPage = pages[pages.length - 1];
		if(currentPage.options.param===undefined)
			throw TypeError();
		this.main(currentPage.options.param)

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})