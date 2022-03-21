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
    jumpPage: function (e) {
      my_library.jumpPage(e);
    },
    
    onChange(event) {
        const { picker, value, index } = event.detail;
        
 
        // picker.setColumnValues(1, this.data.times[value[0]]); //刷新第二列的array

        picker.setColumnValues(1, this.data.time_object[this.data.date_day_object[value[0]]])//刷新第二列的array

        this.setData({
            date:picker.getColumnValue(0),
            time:picker.getColumnValue(1)
        })
      },
    /*
      
     */
    getPickUpTime(id) {
        wx.showLoading({
          title: '',
        });
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getPickupTime2',
            _id:id
          }
        }).then((resp) => {
          console.log(resp)
          if(("pickup_time" in resp.result.delivery) && resp.result.delivery.pickup_time != null){
            this.setData({
              state:3,
              delivery: resp.result.delivery
            })
            wx.hideLoading();
            return 0
          }
     
          this.setData({
            delivery: resp.result.delivery,
            time_object:resp.result.time_object,
            columns:resp.result.columns,
            date:resp.result.date,
            time:resp.result.time,
            date_day_object:resp.result.date_day_object
          });
          // console.log(this.data);
          wx.hideLoading();
      })
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
      this.getPickUpTime(currentPage.options.param);
      
      // this.getADelivery(currentPage.options.param);
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