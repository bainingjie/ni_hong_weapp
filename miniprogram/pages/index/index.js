// index.js
// const app = getApp()
const { envList } = require('../../envList.js');
var my_library = require('../../my_library/index.js')
Page({
  data: {
    bottom_tabs_active_index:1,
    price:'',
    delivery_day:'',
    pay_day:'',
    address:'',
    enter_official_account:'',
    active:0,//tabs
    // activeKey :0
    my_delivery:[],
    description_2_1:'',
    description_2_2:'',
    share_title:"",
    // active_step:0,
    steps: [
      {
        text: '打包',
      },
      {
        text: '支付',
      },
      {
        text: '发货',
      },
      {
        text: '取货',
      }
    ],
  },
  bottomTabbarClicked(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ bottom_tabs_active_index: event.detail });
  },
  onLoad(options) {
    // this.setData({
    //   envId: options.envId
    // });
    this.getPublic();
    this.getDelivery();
  },
  onShow() {
    this.getDelivery();
  },
  customer_service:function(){
    my_library.customer_service();
  },
  copyText: function(e) {
    my_library.copyText(e.currentTarget.dataset.text);
  },
  jumpPage(e) {
    console.log(`/pages/${e.currentTarget.dataset.jump}/index?param=${e.currentTarget.dataset.param}`);
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.jump}/index?param=${e.currentTarget.dataset.param}`,
    });
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
      // console.log(resp);
      this.setData({
        my_delivery: resp.result.data,
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
      this.setData({
        price: resp.result.data.price,
        delivery_day: resp.result.data.delivery_day,
        pay_day: resp.result.data.pay_day,
        address:[resp.result.data.address1,
          resp.result.data.address2,
        resp.result.data.address3,
        resp.result.data.address4],
        // address:resp.result.data.address1+"\n"
        // +resp.result.data.address2+"\n"
        // +resp.result.data.address3+"\n"
        // +resp.result.data.address4,
        enter_official_account:resp.result.data.enter_official_account,
        description_2_1:resp.result.data.description_2_1,
        description_2_2:resp.result.data.description_2_2,
        share_title:resp.result.data.share_title
      });
      // console.log(this.data);
     wx.hideLoading();
   }).catch((e) => {
      console.log(e);
     wx.hideLoading();
   });
  },
  onShareAppMessage() {
    return {
      title: this.data.share_title,
      path: '/pages/index/index',
    }
  }
});
