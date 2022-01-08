function jumpPage(e) {
  // console.log(`/pages/${e.currentTarget.dataset.jump}/index?param=${e.currentTarget.dataset.param}`);
  wx.navigateTo({
    url: `/pages/${e.currentTarget.dataset.jump}/index?param=${e.currentTarget.dataset.param}`,
  });
}
function copyText(text) {
  wx.setClipboardData({
    data: text,
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

function prefectures_function() {
  let prefecture_names = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];
  let prefectures = {};
  for (let p of prefecture_names) {
    prefectures[p] = []
  }
  let output = { prefecture_names: prefecture_names, prefectures: prefectures };
  console.log(output);
  return output;
}



module.exports. customer_service = customer_service;
module.exports.jumpPage = jumpPage;
module.exports.copyText = copyText;
module.exports.prefectures_function = prefectures_function;

