"use strict";
exports.__esModule = true;
exports.randomString = exports.pickup_spots_groupby_prefectures = exports.prefecture_names = exports.customer_service = exports.bottomTabbarClicked = exports.copyText = exports.jumpPage = void 0;
// declare namespace WechatMiniprogram{ type BaseEvent=any;type CustomEvent<T>=any};
// declare const wx: any;
function jumpPage(e) {
    // console.log(`/pages/${e.currentTarget.dataset.jump}/index?param=${e.currentTarget.dataset.param}`);
    wx.navigateTo({
        url: "/pages/".concat(e.currentTarget.dataset.jump, "/index?param=").concat(e.currentTarget.dataset.param)
    });
}
exports.jumpPage = jumpPage;
function copyText(text) {
    console.log("my_library.copyText(text=".concat(text, ") called!"));
    wx.setClipboardData({
        data: text
    });
}
exports.copyText = copyText;
function bottomTabbarClicked(event) {
    // event.detail 的值为当前选中项的索引
    // console.log(event)
    if (event.detail === 2) {
        wx.navigateTo({
            url: "/pages/myPage/index"
        });
    }
    else if (event.detail === 1) {
        wx.navigateTo({
            url: "/pages/index/index"
        });
    }
    else {
        throw Error("unknown value: event.datail=".concat(event.detail));
    }
}
exports.bottomTabbarClicked = bottomTabbarClicked;
function customer_service() {
    wx.openCustomerServiceChat({
        extInfo: { url: 'https://work.weixin.qq.com/kfid/kfc4b923529ee456844' },
        corpId: 'ww4df7b908b4170ed8',
        success: function (res) {
        }
    });
}
exports.customer_service = customer_service;
exports.prefecture_names = [
    "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];
function pickup_spots_groupby_prefectures(pickup_spots) {
    var res = {};
    for (var _i = 0, pickup_spots_1 = pickup_spots; _i < pickup_spots_1.length; _i++) {
        var p = pickup_spots_1[_i];
        var t = p.address.prefecture;
        if (!(t in res))
            res[t] = new Array();
        res[t].push(p);
    }
    return res;
}
exports.pickup_spots_groupby_prefectures = pickup_spots_groupby_prefectures;
function randomString(len) {
    if (len === void 0) { len = 32; }
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    var res = "";
    for (var i = 0; i < len; i++)
        res += t.charAt(Math.floor(Math.random() * t.length));
    return res;
}
exports.randomString = randomString;
