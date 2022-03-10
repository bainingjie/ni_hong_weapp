// pages/selectPickupTime/index.js
var my_library = require('../../my_library/index.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        state:0,
        date:null,
        time:null,
        delivery:null,
        times:null,
        columns: []
    },
    submit:function(){
        if (this.data.date == null || this.data.time == null ) {
          wx.showToast({
            title: '请选择取货时间',
            icon: 'error',
            duration: 1500
          })
          return 1;
        }
        wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data: {
              type: 'selectPickupTime',
              id:this.data.delivery._id,
              date:this.data.date,
              time:this.data.time
            }
          }).then((resp) => {
            if(resp.result.success){
                this.setData({
                  state:1,
                })
            }else{
                this.setData({
                    state:2
                })
            }
            
           wx.hideLoading();
         }).catch((e) => {
            console.log(e);
            wx.hideLoading();
         });
    },
    customer_service:function(){
        my_library.customer_service();
      },
    copyText: function(e) {
        my_library.copyText(e.currentTarget.dataset.text);
    },
    onChange(event) {
        const { picker, value, index } = event.detail;
        picker.setColumnValues(1, this.data.times[value[0]]);
        this.setData({
            date:picker.getColumnValue(0),
            time:picker.getColumnValue(1)
        })
      },
    /**
     * 生命周期函数--监听页面加载
     */
    getADelivery(id) {
        wx.showLoading({
          title: '',
        });
       wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getADelivery',
            _id:id
          }
        }).then((resp) => {
            let delivery = resp.result.data[0];
            let times = delivery.times;
            let col = [
                {
                  values: Object.keys(times),
                  className: 'column1',
                },
                {
                  values: times[Object.keys(times)[0]],
                  className: 'column2',
                  defaultIndex: 0,
                },
              ];
        //   console.log(resp);
          this.setData({
            delivery: delivery,
            times:times,
            columns:col,
            date:Object.keys(times)[0],
            time:times[Object.keys(times)[0]][0],
          });
          // console.log(this.data);
         wx.hideLoading();
       }).catch((e) => {
          console.log(e);
          wx.hideLoading();
       });
      },
    onLoad: function (options) {

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
      let pages = getCurrentPages();
      let currentPage = pages[pages.length-1];
      this.getADelivery(currentPage.options.param);
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