// pages/pickUpSpots/index.ts

import { ALL_JAPAN_PREFECTURES, IPickupSpot } from "../getDelivery/Delivery";


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		prefecture_names: <readonly string[] | undefined>undefined,
		prefectures: <{ [key: string]: Array<IPickupSpot> } | undefined>undefined
	},
	copyText: function (e: any) {
		wx.setClipboardData({
			// data:'收件人 霓虹町指南(449306)\n电话 15673148424\n邮编 410137\n 地址 湖南省长沙市长沙县黄花镇长沙邮政国际互换局天马集运仓(449306)',
			data: e.target.dataset.url,
		})
	},
	getPickUpSpots() {
		wx.showLoading({
			title: '',
		});
		wx.cloud.callFunction({
			name: 'quickstartFunctions',
			data: {
				type: 'getPickUpSpots'
			}
		}).then((resp) => {
			// console.log(resp.result.data);

			let prefectures: { [key: string]: Array<IPickupSpot> } = {};
			// for (let p of ALL_JAPAN_PREFECTURES) {
			// 	prefectures[p] = []
			// }
			for (let _spot of (resp.result as DB.IQueryResult).data) {
				const spot = _spot as IPickupSpot;
				// console.log(spot.address)
				const k = spot.address.prefecture;
				if (!(k in prefectures))
					prefectures[k] = new Array<IPickupSpot>();
				prefectures[k].push(spot);
			}
			// console.log(prefectures)
			this.setData({
				prefecture_names: ALL_JAPAN_PREFECTURES,
				prefectures
			});
			wx.hideLoading();
		}).catch((e) => {
			console.log(e);
			wx.hideLoading();
		});
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getPickUpSpots();
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