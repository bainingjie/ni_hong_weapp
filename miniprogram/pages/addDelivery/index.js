// pages/addDelivery/index.js
var my_library = require('../../my_library/index.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        prefecture_names:null,
        prefectures:null,
        pick_up_spot:"请选择自提点",
        // trimmed_prefectures:null,
        // prefecture_columns: null,
        // name_columns: null,
        tracking_number:"",
        tracking_numbers:[],
        phone:"",
        state:0, //0:初始 1:添加成功 2：添加失败
        official_account_url:""
    },
    jumpPage: function(e) {
      my_library.jumpPage(e);
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
    },
    //获取input的值(随时修改input)
    getInputVal:function(e){
        // console.log(e);
        var val=e.detail;//获取输入的值
        var tracking_number=this.data.tracking_number;
        tracking_number = val;
        this.setData({
            tracking_number
        })
    },
    //添加input
    add:function(){
      if(this.data.tracking_number.length>0){
        var tracking_numbers=this.data.tracking_numbers;
        // console.log(old[old.length-1]);
        tracking_numbers.push(this.data.tracking_number);
        this.setData({
            tracking_numbers,
            tracking_number:""
        })
      }else{
        wx.showToast({
          title: '无效单号',
          icon: 'error',
          duration: 1500
        })
      }
    },
    //删除input
    delInput:function(e){
        // console.log("clicked");
        var nowidx=e.currentTarget.dataset.idx;//当前索引
        var tracking_numbers=this.data.tracking_numbers;//所有的input值
        tracking_numbers.splice(nowidx,1);//view删除了对应的input值也要删掉
        this.setData({
            tracking_numbers
        })
    },

    submit:function(){
        var tracking_numbers =this.data.tracking_numbers;
        var pick_up_spot = this.data.pick_up_spot;
        var phone = this.data.phone
        if(tracking_numbers.length>0 && pick_up_spot != "请选择自提点" && phone.length>0){
           wx.showLoading({
            title: '',
          });
         wx.cloud.callFunction({
            name: 'quickstartFunctions',
            config: {
              env: "testbai-6gjgkia55f6d4918"
            },
            data: {
              type: 'addDelivery',
              tracking_numbers: this.data.tracking_numbers,
              pick_up_spot: this.data.pick_up_spot,
              phone:this.data.phone
            }
          }).then((resp) => {
          //  console.log(resp);
            wx.hideLoading();
            if(resp.result.success){
              this.setData({
                state:1,
                official_account_url:resp.result.official_account_url
              })
            }else{
              this.setData({
                state:2
              })
            }
         }).catch((e) => {
            console.log(e);
            this.setData({
              state:2
            })
           wx.hideLoading();
         });
        }else{
          wx.showToast({
            title: '请填写完整',
            icon: 'error',
            duration: 1500
          })
        }
    },

    getDelivery() {
      wx.showLoading({
        title: '',
      });
     wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getDelivery'
        }
      }).then((resp) => {
        console.log(resp);
        if(resp.result.data.length>0){
          this.setData({
            phone: resp.result.data[0].phone,
          });
        }
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
      wx.showLoading({
        title: '',
      });
     this.getDelivery();
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