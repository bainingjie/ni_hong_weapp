function jumpPage(e) {
    // console.log(`/pages/${e.currentTarget.dataset.jump}/index?param=${e.currentTarget.dataset.param}`);
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.jump}/index?param=${e.currentTarget.dataset.param}`,
    });
}
function copyText(text){
  wx.setClipboardData({
    data:text,
  })
}

function customer_service(){
  wx.openCustomerServiceChat({
    extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc4b923529ee456844'},
    corpId: 'ww4df7b908b4170ed8',
    success(res) {
    }
  })
}


module.exports. jumpPage =  jumpPage;
module.exports. copyText =  copyText;
module.exports. customer_service = customer_service;
