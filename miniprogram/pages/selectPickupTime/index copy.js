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
            type: 'getPickupTime',
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

          
          let tokyo_time = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
          tokyo_time = new Date(tokyo_time)
          tokyo_time = tokyo_time.setDate(tokyo_time.getDate() + 1);//最早显示次日的时间
          tokyo_time = new Date(tokyo_time)
          let tokyo_day = tokyo_time.getDay()
          let day_array = []
          for(let i = 0;i<7; i++){
            day_array.push((tokyo_day+i)%7)
          }
          let date_array = []
          let date_day_object = {}
          let temp_date = null
          for(let i = 0;i<7; i++){
            temp_date = String(tokyo_time.getMonth()+1)+"月"+String(tokyo_time.getDate())+"日"+"("+my_library.dayConverter(day_array[i])+")"
            date_array.push(temp_date)
            date_day_object[temp_date] = day_array[i]
            // console.log(date_array)
            tokyo_time = tokyo_time.setDate(tokyo_time.getDate() + 1);
            tokyo_time = new Date(tokyo_time)
          }
          
          let delivery = resp.result.delivery;
          let time_object = resp.result.pickup_spot.time_object;
          let temp = time_object[day_array[0]]
          let col = [
              {
                values: date_array,
                className: 'column1',
              },
              {
                values: temp,
                className: 'column2',
                defaultIndex: 0,
              },
            ];
            this.setData({
              delivery: delivery,
              time_object:time_object,
              columns:col,
              date:(date_array[0]),
              time:(time_object[day_array[0]][0]),
              date_day_object:date_day_object
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