// pages/shop/index.ts
import * as my_library from '../../my_library/index';
import { IProduct} from '../getDelivery/Delivery';
import type {main as getProducts} from '../../../cloudfunctions/quickstartFunctions/getProducts'
Page({

	/**
	 * 页面的初始数据
	 */
	data: <{is_ready: boolean, products: IProduct[]}>{
		is_ready: false,
		products: [],
	},
	getProducts() {
		wx.showLoading({
			title: '',
		});
		wx.cloud.callFunction<typeof getProducts>({
			name: 'quickstartFunctions',
			data: {
				type: 'getProducts',
			}
		}).then((resp) => {
			console.log(`quickstart function call of getProducts returns resp=${JSON.stringify(resp)}`);
			if (resp.result === undefined || typeof resp.result === 'string')
				throw new TypeError(`resp.result=${resp.result}`);

			this.setData({
				products: resp.result.data,
			});
			// console.log(this.data);
			wx.hideLoading();
		}).catch((e) => {
			console.log(e);
			wx.hideLoading();
		});
	},
	jumpPage(e: WechatMiniprogram.BaseEvent) {
		console.log(e)
		my_library.jumpPage(e);
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
		this.setData({
			is_ready: true
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getTabBar().init();
		this.getProducts();
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