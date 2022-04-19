
import * as my_library from '../../my_library/index';
import { IDelivery } from './Delivery';
import type {main as getADelivery} from '../../../cloudfunctions/quickstartFunctions/getADelivery/index'
import type {main as payDelivery} from '../../../cloudfunctions/quickstartFunctions/payDelivery/index'
// pages/getDelivery/index.js
const d = {};
Page({

	/**
	 * 页面的初始数据
	 */
	data: d,
	// <{delivery:IDelivery|null|undefined}>{
		// delivery: undefined
	// },
	jumpPage: function (e: WechatMiniprogram.BaseEvent) {
		my_library.jumpPage(e);
	},
	copyText: function (e: WechatMiniprogram.BaseEvent) {
		my_library.copyText(e.currentTarget.dataset.text);
	},
	getADelivery(id: DB.DocumentId) {
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

			const result = resp.result;
			console.assert('data' in result);
			console.assert(result.data.length>0);
			this.setData({
				delivery: result.data[0],
			});
			// console.log(this.data);
			wx.hideLoading();

		}).catch((e) => {
			console.log(e);
			wx.hideLoading();
		});
	},

	// pay() {
	// 	console.log("pay() called!")
	// 	if(this.data.delivery===null){
	// 		throw TypeError();
	// 	}
	// 	let that = this;
	// 	if(typeof this.data.delivery.amount_to_pay === 'string')
	// 		throw new TypeError();
	// 	if(this.data.delivery._id === undefined)
	// 		throw new TypeError();

	// 	wx.cloud.callFunction<typeof payDelivery>({
	// 		name: 'quickstartFunctions',
	// 		data: {
	// 			type: 'payDelivery',
	// 			delivery_id: this.data.delivery._id.toString(),
	// 			amount_to_pay: this.data.delivery.amount_to_pay
	// 		}}).then((res) => {
	// 			console.log("pay() called successfully.");
	// 			console.log(res);
	// 			if(res.result === undefined || typeof res.result ==="string")
	// 				throw new TypeError();
	// 			if(res.result.returnCode!=='SUCCESS')
	// 				throw new Error('payment returnCode = FAIL');

	// 			const payment = res.result.payment;

	// 			wx.requestPayment({
	// 				...payment,
	// 				success(res: any) {
	// 					console.log('pay success', res)
	// 					that.getADelivery(that.data.delivery?._id!)
	// 				},
	// 				fail(err: any) {
	// 					console.error('pay fail', err)
	// 				}
	// 			})
	// 		}).catch(res => {
	// 			console.error("pay() failed.");
	// 			console.error(res);
	// 		})
		
	// },
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options: any) {

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
		this.getADelivery(currentPage.options.param)
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