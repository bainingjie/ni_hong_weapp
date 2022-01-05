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




module.exports. jumpPage =  jumpPage;
module.exports. copyText =  copyText;
