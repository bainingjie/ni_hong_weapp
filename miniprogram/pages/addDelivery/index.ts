// pages/addDelivery/index.ts
import * as my_library from '../../my_library/index';
import { IPackage, IPickupSpot } from '../getDelivery/Delivery';
import type { main as addDelivery} from '../../../cloudfunctions/quickstartFunctions/addDelivery/index'
import type {main as getPickUpSpots} from '../../../cloudfunctions/quickstartFunctions/getPickUpSpots/index'
import type {main as getDelivery} from '../../../cloudfunctions/quickstartFunctions/getDelivery/index'
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		show: false,
		prefecture_names: <readonly string[]>[],
		prefectures: <{[k:string]:IPickupSpot[]}>{},
		pickup_spot: "请选择自提点",
		// trimmed_prefectures:null,
		// prefecture_columns: null,
		// name_columns: null,
		tracking_number: "",
		package_content: "",
		package_note: "",
		shipping_details: new Array<IPackage>(),
		phone: "",
		state: 0, //0:初始 1:添加成功 2：添加失败
		official_account_url: ""
	},
	jumpPage: function (e: WechatMiniprogram.BaseEvent) {
		my_library.jumpPage(e);
	},
	setPickUpSpot(e: WechatMiniprogram.BaseEvent) {
		this.setData({
			pickup_spot: e.target.dataset.name
		})
		this.onClose();
	},

	showPopup() {
		this.setData({ show: true });
	},
	onClose() {
		this.setData({ show: false });
	},
	//获取input的值(随时修改input)
	getInputVal: function (e: WechatMiniprogram.CustomEvent<string>) {
		// console.log(e);
		const val = e.detail;//获取输入的值
		// console.log('val=',typeof val);
		// let tracking_number = this.data.tracking_number;
		// tracking_number = val;
		this.setData({
			tracking_number: val
		})
	},
	//添加input
	add: function () {
		console.assert(typeof this.data.tracking_number === 'string');
		console.assert(typeof this.data.package_content === 'string');
		if (this.data.tracking_number.length > 0 && this.data.package_content.length > 0) {
			let details = this.data.shipping_details;
			// console.log(old[old.length-1]);
			details.push({
				tracking_number: this.data.tracking_number,
				content: this.data.package_content,
				note: this.data.package_note,
				weight: null
			});
			this.setData({
				shipping_details: details,
				tracking_number: "",
				package_content: "",
				package_note: ""
			})
		} else if (this.data.tracking_number === "") {
			wx.showToast({
				title: "无效单号",
				icon: "error",
				duration: 1500
			})
		} else if (this.data.package_content === "") {
			wx.showToast({
				title: "请填写包裹内容",
				icon: "error",
				duration: 1500
			})
		}
	},
	//删除input
	delInput: function (e: WechatMiniprogram.BaseEvent<Record<string, any>, { idx: number }>) {
		// console.log("clicked");
		let nowidx = e.currentTarget.dataset.idx;//当前索引
		let details = this.data.shipping_details;//所有的input值
		details.splice(nowidx, 1);//view删除了对应的input值也要删掉
		this.setData({
			shipping_details: details
		})
	},

	submit: function () {
		let details = this.data.shipping_details;
		let tracking_number = this.data.tracking_number;
		let pickup_spot = this.data.pickup_spot;
		let phone = this.data.phone;
		console.debug(details, tracking_number);
		console.debug("submitting...")
		if (details.length > 0 && pickup_spot !=="请选择自提点" && phone.length > 0 && tracking_number==="") {
			console.debug("alice");
			wx.showLoading({
				title: "",
			});
			wx.cloud.callFunction<typeof addDelivery>({
				name: 'quickstartFunctions',
				// config: {
				// 	env: "testbai-6gjgkia55f6d4918"
				// },
				data: {
					type: 'addDelivery',
					arg: {
						shipping_details: this.data.shipping_details,
						// tracking_numbers: this.data.shipping_details,
						pickup_spot: this.data.pickup_spot,
						phone: this.data.phone
					}
				}
			}).then((resp) => {
				const result= resp.result;
				console.debug(resp);
				console.assert('requestID' in resp);
				console.assert(typeof resp.requestID === 'string')
				//  console.log(resp);
				wx.hideLoading();
				if (result.success) {
					this.setData({
						state: 1,
						official_account_url: result.official_account_url
					})
				} else {
					this.setData({
						state: 2
					})
				}
			}).catch((e) => {
				console.log(e);
				this.setData({
					state: 2
				})
				wx.hideLoading();
			});

		} else if (phone.length == 0) {
			wx.showToast({
				title: '请填写手机号',
				icon: 'error',
				duration: 1500
			})
		} else if (pickup_spot == "请选择自提点") {
			wx.showToast({
				title: '请选择自提点',
				icon: 'error',
				duration: 1500
			})
		} else if (details.length == 0) {
			wx.showToast({
				title: '请添加快递单号',
				icon: 'error',
				duration: 1500
			})
		} else if (tracking_number.length > 0) {
			wx.showToast({
				title: '请添加这件快递',
				icon: 'error',
				duration: 1500
			})
		} else{
			throw Error('NotImplemented');
		}

	},

	getDelivery() {
		wx.showLoading({
			title: '',
		});
		wx.cloud.callFunction<typeof getDelivery>({
			name: 'quickstartFunctions',
			data: {
				type: 'getDelivery'
			}
		}).then((resp) => {
			console.debug('resp=')
			console.debug(resp);
			if (resp.result.data.length > 0) {
				this.setData({
					phone: resp.result.data[0].phone,
				});
			}
			// console.log(this.data);
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
		wx.showLoading({
			title: '',
		});
		this.getDelivery();
		wx.cloud.callFunction<typeof getPickUpSpots>({
			name: 'quickstartFunctions',
			data: {
				type: 'getPickUpSpots'
			}
		}).then((resp) => {
			// console.log(resp.result.data);
			let output = my_library.prefectures_function<IPickupSpot>();
			//console.log(output);
			let prefecture_names = output.prefecture_names;
			let prefectures = output.prefectures;
			for (let spot of resp.result.data) {
				// console.log(spot.address)
				prefectures[spot.address.prefecture].push(spot)
			}
			// console.log(prefectures)
			this.setData({
				prefecture_names,
				prefectures
			});
			wx.hideLoading();
		}).catch((e) => {
			console.log(e);
			wx.hideLoading();
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