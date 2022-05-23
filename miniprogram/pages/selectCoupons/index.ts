// pages/payDelivery/index.ts
import type { main as getADelivery } from '../../../cloudfunctions/quickstartFunctions/getADelivery/index';
import type { main as getCouponForUser } from '../../../cloudfunctions/quickstartFunctions/getCouponForUser/index';
import { ICoupon, ICouponUser, IDelivery } from '../getDelivery/Delivery';

type D = {
	delivery?: IDelivery;
	coupons?: [ICouponUser, ICoupon][];
	selectedCouponIndices?: string[];
};


Page({

	/**
	 * 页面的初始数据
	 */
	data: <D>{},
	onChange(event: WechatMiniprogram.CustomEvent<string[]>) {
		console.log("onChange event.datail=",event.detail)
		this.setData({
			selectedCouponIndices: event.detail,
		},this.checkout);
	},
	toggle(event: WechatMiniprogram.BaseEvent) {
		console.log("toggle event=",event);
		const { index } = event.currentTarget.dataset;
		const checkbox = this.selectComponent(`.checkboxes-${index}`);
		checkbox.toggle();
	},

	noop(event:WechatMiniprogram.BaseEvent) {
		console.log("noop event=", event);
	},
	checkout(){
		let sum:number = 0;
		const indices:number[]=this.data.selectedCouponIndices!.map((x:string)=>+x);
		for(const i of indices){
			const x=this.data.coupons![i][1]
		}
	},
	async getCoupons(delivery: IDelivery) {
		wx.showLoading({
			title: '',
		});
		try {
			const resp = await wx.cloud.callFunction<typeof getCouponForUser>({
				name: 'quickstartFunctions',
				data: {
					type: 'getCouponForUser',
					open_id: delivery.open_id
				}
			})
			const coupons = resp.result;
			console.log("user (user_id=",delivery.open_id,")'s coupons=",coupons);
			console.assert(coupons !== null);
			
			this.setData({ coupons });
			wx.hideLoading();
		} catch (e) {
			console.log(e);
			wx.hideLoading();
		}

	},
	onSubmit() {
		console.log("onSubmit() called!");
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const eventChannel = this.getOpenerEventChannel();
		console.assert(eventChannel !== undefined);
		eventChannel.on("currentDelivery", async (delivery: IDelivery) => {
			this.setData({ delivery });
			await this.getCoupons(delivery);
		});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		// // console.log("onshow() called!");
		// // 获取当前小程序的页面栈
		// let pages = getCurrentPages();
		// // 数组中索引最大的页面--当前页面
		// // console.log(pages)	
		// let currentPage = pages[pages.length - 1];
		// if (currentPage.options.param === undefined)
		// 	throw TypeError();
		// await this.main(currentPage.options.param)

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