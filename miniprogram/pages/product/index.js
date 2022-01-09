// pages/product/index.js
var my_library = require('../../my_library/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    state:0,// 0是商品界面，1是支付成功界面，2是支付失败界面。
    product: null,
    sku_length: 0,
    subtitle: "",
    show: false,
    prefecture_names: null,
    prefectures: null,
    pick_up_spot: "请选择自提点",
    // trimmed_prefectures:null,
    // prefecture_columns: null,
    // name_columns: null,
    tracking_number: "",
    tracking_numbers: [],
    phone: "",
    state: 0, //0:初始 1:添加成功 2：添加失败
    official_account_url: "",
    type_index: 0, // sku_index
  },
  pay() {
    let that = this;
    //console.log(this.data.product);
    //console.log(this.data.product.sku[this.type_index]);

    if (this.data.pick_up_spot == "请选择自提点" ) {
      wx.showToast({
        title: '请选择自提点',
        icon: 'error',
        duration: 1500
      })
      return 1;
    }

    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'payTrade',
        //type:1, //type是0代表集运，1代表商城交易
        //delivery_id: this.data.delivery._id,
        product_id:this.data.product._id,
        sku_index:this.data.type_index,
        amount_to_pay: this.data.product.sku[this.data.type_index].price,
        pick_up_spot:this.data.pick_up_spot,
        currency:this.data.product.sku[this.data.type_index].currency
      },
      success: res => {
        console.log(res)
        const payment = res.result.payment
        wx.requestPayment({
          ...payment,
          success(res) {
            console.log('pay success', res)
            that.setData({
              state:1
            })
          },
          fail(err) {
            console.error('pay fail', err)
          }
        })
      },
      fail:err=>{
        console.error
        that.setData({
          state:2
        })
      } 
    })
  },
  tag_clicked(e) {
    // console.log(e.currentTarget.dataset.index);
    this.setData({
      type_index: e.currentTarget.dataset.index
    })
  },
  getProduct() {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getProduct',
        id: ""
      }
    }).then((resp) => {
      console.log(resp);
      this.setData({
        product: resp.result.data,
        sku_length: resp.result.data.sku.length,
        subtitle: resp.result.data.text.subtitle.split('&hc').join('\n')
      });
      // console.log(this.data);
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      wx.hideLoading();
    });
  },
  setPickUpSpot(e) {
    this.setData({
      pick_up_spot: e.target.dataset.name
    })
    this.onClose();
  },

  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct();
    wx.showLoading({
      title: '',
    });
    //this.getDelivery();
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getPickUpSpots'
      }
    }).then((resp) => {
      // console.log(resp.result.data);
      let output = my_library.prefectures_function();
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
    return {
      title: this.data.product.text.name,
      // path: '/pages/index/index',
    }
  }
})