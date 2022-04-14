// pages/calculation_simulation/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        weight:null,
        trimmed_weight:null,
        price_estimate:null,
        price_opponent:null,

        price_500g:null,
        price:null,
        opponent_head_500g:null,
        opponent_price_500g:null,
        weight_example:null
    },
    getInputVal:function(e){
        let val=e.detail;//获取输入的值
        let weight=this.data.weight;
        let trimmed_weight = this.data.trimmed_weight;
        weight = val;
        let ceil = Math.ceil(weight);
        let floor = Math.floor(weight);

       if(weight==floor){
            trimmed_weight = floor;
       } else if(weight-floor<=0.5){
            trimmed_weight = floor + 0.5;
        }else{
            trimmed_weight = ceil;
        }
        // let price_estimate = this.data.price_estimate;
        // price_estimate = trimmed_weight*this.data.price_500g*2
        var price_opponent = this.data.price_opponent;
        if(trimmed_weight>0.5){
          price_opponent=this.data.opponent_head_500g+(trimmed_weight-0.5)*this.data.opponent_price_500g*2+4
        }else{
          price_opponent=this.data.opponent_head_500g
        }
        if(weight< 0 ){
          weight=null;
          trimmed_weight=null;
        }else if(weight>15){
          weight=null;
          trimmed_weight=null;
          wx.showToast({
            title: '不能超过15kg哦',
            icon: 'error',
            duration: 1500
          })
        }
        this.setData({
          weight,
          trimmed_weight,
          price_estimate : trimmed_weight?(trimmed_weight*this.data.price_500g*2+4):null,
          price_opponent : (trimmed_weight&&trimmed_weight<10)?price_opponent:null
        })

        // console.log(this.data.price_estimate)
    },
    getPublic() {
        wx.showLoading({
          title: '',
        });
       wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getPublicData'
          }
        }).then((resp) => {
          // console.log(resp);
          // let temp = resp.result.data.address;
          // let temp2 = temp.replace(/"/g, "'");
          // console.log(temp,temp2)
          this.setData({
            // haveGetRecord: true,
            price: resp.result.data.price,
            price_500g: resp.result.data.price_500g,
            opponent_head_500g:resp.result.data.opponent_head_500g,
            opponent_price_500g:resp.result.data.opponent_price_500g,
            weight_example:resp.result.data.weight_example.replace(/\\n/,'\n')
          });
          // console.log(this.data);
         wx.hideLoading();
       }).catch((e) => {
          console.log(e);
          this.setData({
            showUploadTip: true
          });
         wx.hideLoading();
       });
      },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPublic();
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