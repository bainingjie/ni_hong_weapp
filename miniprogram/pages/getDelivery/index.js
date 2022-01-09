
var my_library = require('../../my_library/index.js')
// pages/getDelivery/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delivery: null,
  },
  jumpPage: function (e) {
    my_library.jumpPage(e);
  },
  copyText: function (e) {
    my_library.copyText(e.currentTarget.dataset.text);
  },
  getADelivery(id) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getADelivery',
        _id: id
      }
    }).then((resp) => {
      //   console.log(resp);
      this.setData({
        delivery: resp.result.data[0],
      });
      // console.log(this.data);
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.hideLoading();
    });
  },

  pay() {
    let that = this;
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'payDelivery',
        delivery_id: this.data.delivery._id,
        amount_to_pay: this.data.delivery.amount_to_pay
      },
      success: res => {
        console.log(res)
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success(res) {
            console.log('pay success', res)
            that.getADelivery(that.data.delivery._id)
          },
          fail(err) {
            console.error('pay fail', err)
          }
        })
      },
      fail: console.error,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getADelivery(options.param)
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