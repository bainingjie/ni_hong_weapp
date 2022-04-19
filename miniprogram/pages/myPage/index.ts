// pages/myPage/index.ts
import * as my_library from '../../my_library/index'
import type {main as getDelivery} from '../../../cloudfunctions/quickstartFunctions/getDelivery/index'
import { IDelivery } from '../getDelivery/Delivery';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        bottom_tabs_active_index:2,
        my_delivery:new Array<IDelivery>(),
        // steps: [
        //     {text: '打包'},
        //     {text: '支付'},
        //     {text: '发货'},
        //     {text: '取货'}
        // ],
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
            // console.log(resp);
            
            this.setData({
                my_delivery: resp.result.data,
            });
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
    bottomTabbarClicked(event: WechatMiniprogram.CustomEvent<number>) {
        my_library.bottomTabbarClicked(event);
    },
    jumpPage(e: WechatMiniprogram.BaseEvent) {
        my_library.jumpPage(e);
    },
    onLoad: function (options: any) {
        // this.getDelivery();
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
        this.getDelivery();
        this.getTabBar().init();
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