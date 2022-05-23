
import * as my_library from '../../my_library/index';
import { IDelivery, ICouponUser, ICoupon } from './Delivery';
import type { main as getADelivery } from '../../../cloudfunctions/quickstartFunctions/getADelivery/index'
import type { main as payDelivery } from '../../../cloudfunctions/quickstartFunctions/payDelivery/index'
import type { main as getCouponForUser } from '../../../cloudfunctions/quickstartFunctions/getCouponForUser/index';
import type {main as doNothing } from '../../../cloudfunctions/quickstartFunctions/doNothing/index';
import type {main as useCoupon} from '../../../cloudfunctions/quickstartFunctions/useCoupon/index';
// pages/getDelivery/index.js
type D = {
	couponPopupShow: boolean;
	delivery?: IDelivery;
	coupons?: [ICouponUser, ICoupon][];
	selectedCouponIndices: string[];
	label: string;
	couponUseConfirmed: boolean;
	discount: number;
};
Page({

	/**
	 * 页面的初始数据
	 */
	data: <D>{
		couponPopupShow: false,
		selectedCouponIndices: [],
		label: "合计: ",
		couponUseConfirmed: true,
		discount: 0
	},
	// <{delivery:IDelivery|null|undefined}>{
	// delivery: undefined
	// },
	jumpPage: function (e: WechatMiniprogram.BaseEvent) {
		const { jump, param } = e.currentTarget.dataset;
		console.assert(typeof jump === 'string');
		if (jump === "selectCoupons") {
			console.assert(param !== undefined);
			console.assert(param !== null);

			wx.navigateTo({
				url: `/pages/${jump}/index`,
				success(res: WechatMiniprogram.NavigateToSuccessCallbackResult) {
					res.eventChannel.emit("currentDelivery", param);
				}
			})
		}
		else my_library.jumpPage(e);
	},
	copyText: function (e: WechatMiniprogram.BaseEvent) {
		my_library.copyText(e.currentTarget.dataset.text);
	},
	// async getADelivery(id: DB.DocumentId) {
	// 	wx.showLoading({
	// 		title: '',
	// 	});
	// 	try{
	// 		const resp = await wx.cloud.callFunction<typeof getADelivery>({
	// 			name: 'quickstartFunctions',
	// 			data: {
	// 				type: 'getADelivery',
	// 				_id: id
	// 			}
	// 		})

	// 		const result = resp.result;
	// 		console.assert('data' in result);
	// 		console.assert(result.data.length>0);
	// 		this.setData({
	// 			delivery: result.data[0],
	// 		});
	// 		// console.log(this.data);
	// 		wx.hideLoading();

	// 	}catch(e){
	// 		console.log(e);
	// 		wx.hideLoading();
	// 	}
	// },

	async pay() {
		console.log("pay() called!")
		if(this.data.delivery===null){
			throw TypeError();
		}

		if(typeof this.data.delivery?.amount_to_pay === 'string')
			throw new TypeError();
		if(this.data.delivery?._id === undefined)
			throw new TypeError();
		try{
			const res = await wx.cloud.callFunction<typeof payDelivery>({
				name: 'quickstartFunctions',
				data: {
					type: 'payDelivery',
					delivery_id: this.data.delivery._id.toString(),
					amount_to_pay: this.data.delivery.amount_to_pay-this.data.discount
				}
			});
			console.log("pay() called successfully.");
			console.log(res);
			if(res.result === undefined || typeof res.result ==="string")
				throw new TypeError();

			const {unified_order_res, payment_id} = res.result;
			if(unified_order_res.returnCode!=='SUCCESS')
				throw new Error('payment returnCode = FAIL');

			const coupon_users = this.data.selectedCouponIndices.map(i=>this.data.coupons![+i][0]);
			wx.requestPayment({
				...unified_order_res.payment,
				async success(res: any) {
					console.log('pay success', res)
					wx.cloud.callFunction<typeof useCoupon>({
						name: 'quickstartFunctions',
						data: {
							type: 'useCoupon',
							coupon_users,
							payment_id 
						}
					})
				},
				fail(err: any) {
					console.error('pay fail', err)
				}
			});
		}catch(e){
			console.error("pay() failed.");
			console.error(e);
		}
	},
	// },
	/**
	 * 生命周期函数--监听页面加载
	 */
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
			console.log("user (user_id=", delivery.open_id, ")'s coupons=", coupons);
			console.assert(coupons !== null);

			this.setData({ coupons });
			wx.hideLoading();
		} catch (e) {
			console.log(e);
			wx.hideLoading();
		}

	},
	showPopup() {
		this.setData({ couponPopupShow: true , couponUseConfirmed: false});
	},

	onPopupClose() {
		this.setData({ couponPopupShow: false ,couponUseConfirmed: false, label: "合计: ", discount: 0});
	},
	onConfirmPopupClose(){
		this.setData({ couponPopupShow: false ,couponUseConfirmed: true});
	},
	onCouponCheckboxChange(event: WechatMiniprogram.CustomEvent<string[]>) {
		console.log("onChange event.datail=",event.detail)
		this.setData({
			selectedCouponIndices: event.detail,
			couponUseConfirmed: true,
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
		const indices=this.data.selectedCouponIndices;
		const selectedCoupons=indices.map(i=>this.data.coupons![parseInt(i)][1]);
		
		let lijian=0, zhekou=0;
		for(const c of selectedCoupons){
			if(/^立减\d+元$/.test(c.description)){
				const val = parseInt(c.description.replace("立减", "").replace("元", ""));
				lijian+=val;
			}else if(/^\d+% OFF$/.test(c.description)){
				const val = parseInt(c.description.replace("% OFF", ""));
				zhekou+=val;
			}else{
				throw new Error("NotImplementedError");	
			}
		}
		if(zhekou>100) zhekou=100;
		console?.log("lijian", lijian, "zhekou", zhekou);
		const amount_to_pay = this.data.delivery?.amount_to_pay;

		if(typeof amount_to_pay === "number"){
			zhekou=zhekou/100*amount_to_pay;
			const sum = Math.min(amount_to_pay, lijian+zhekou);

			if(sum>0){
				this.setData({
					label:`已优惠¥${sum.toFixed(2)}, 合计: `,
					discount: sum
				})
				console.log("this.data.label", this.data.label);
			}
			else{
				this.setData({
					label:`合计: `,
					discount: sum
				})
			}
			
		}
		else throw new Error();

	},
	onSubmitOrder(){

	},
	onLoad: function (options: any) {
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on("currentDelivery", async (delivery: IDelivery) => {
			this.setData({
				delivery
			});
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
	onShow: function () {
		// console.log("onshow() called!");
		// 获取当前小程序的页面栈
		// let pages = getCurrentPages();
		// // 数组中索引最大的页面--当前页面
		// // console.log(pages)	
		// let currentPage = pages[pages.length - 1];
		// if(currentPage.options.param===undefined)
		// 	throw TypeError();
		// this.getADelivery(currentPage.options.param)
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