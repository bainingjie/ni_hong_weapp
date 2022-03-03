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
    tab0_title:"公告",
    tab1_title:"开始集运"
  },
  bottomTabbarClicked(event) {
    my_library.bottomTabbarClicked(event);
  },
  tabClicked(event) {
    console.log(event.detail.name)
    if(event.detail.name == 0){
      this.setData({
        active:0
      })
    }else if (event.detail.name == 1){
      this.setData({
        active:1
      })
    }
  },
  startClicked() {
    console.log(this.data.active)
    this.setData({
      active:1
    })
  },
  onLoad(options) {
    this.getPublic();
    if("process" in options){
      this.setData({
        active:1
      });
    }
  },
  onShow() {
    this.getTabBar().init();
    this.getPublic();
  },
  customer_service:function(){
    my_library.customer_service();
  },
  copyText: function(e) {
    my_library.copyText(e.currentTarget.dataset.text);
  },
  jumpPage(e) {
    my_library.jumpPage(e);
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
