// pages/product/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        product:null,
        sku_length:0,
        subtitle:"",

        type_index:0,
    },
    tag_clicked(e){
        // console.log(e.currentTarget.dataset.index);
        this.setData({
            type_index:e.currentTarget.dataset.index
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
            id:""
          }
        }).then((resp) => {
          console.log(resp);
          this.setData({
            product: resp.result.data,
            sku_length:resp.result.data.sku.length,
            subtitle:resp.result.data.text.subtitle.split('&hc').join('\n')
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
        this.getProduct();
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
    },
    setPickUpSpot(e){
      this.setData({
        pick_up_spot:e.target.dataset.name
      })
      this.onClose();
    },

    showPopup() {
      this.setData({ show: true });
    },
    onClose() {
      this.setData({ show: false });
    }
})