// pages/pickUpSpot/index.ts
import * as my_library from '../../my_library/index'
import { IPickupSpot } from '../getDelivery/Delivery';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        spot:<IPickupSpot|null>null,
    },
    copyText: function(e:WechatMiniprogram.BaseEvent) {
        my_library.copyText(e.currentTarget.dataset.text);
    },
    getSpot(name: string) {
        wx.showLoading({
          title: '',
        });
       wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getPickUpSpot',
            name:name
          }
        }).then((resp) => {
          console.log(resp);
          this.setData({
            spot: (resp.result! as DB.IQueryResult<IPickupSpot>).data[0],
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
    onLoad: function (options) {
        this.getSpot(options.param!);
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