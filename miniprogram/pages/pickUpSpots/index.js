// pages/pickUpSpots/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        prefecture_names:null,
        prefectures:null
    },
    copyText:function(e){
        wx.setClipboardData({
          // data:'收件人 霓虹町指南(449306)\n电话 15673148424\n邮编 410137\n 地址 湖南省长沙市长沙县黄花镇长沙邮政国际互换局天马集运仓(449306)',
          data:e.target.dataset.url,
        })
      },
    getPickUpSpots() {
        wx.showLoading({
          title: '',
        });
       wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getPickUpSpots'
          }
        }).then((resp) => {
            // console.log(resp.result.data);
            let prefecture_names= ["北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
                                    "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
                                    "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
                                    "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
                                    "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
                                    "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
                                    "熊本県","大分県","宮崎県","鹿児島県","沖縄県"];
            let prefectures = {};
            for(let p of prefecture_names){
                prefectures[p]=[]
            }
            for(let spot of resp.result.data){
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPickUpSpots();
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