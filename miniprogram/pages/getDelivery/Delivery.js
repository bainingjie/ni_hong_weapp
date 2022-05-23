"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.assertIPackage = exports.DeliveryState = exports.getDBCollection = exports.ALL_JAPAN_PREFECTURES = void 0;
exports.ALL_JAPAN_PREFECTURES = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
    "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
    "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
    "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
    "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
    "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
    "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];
var db_collection_names = [
    "baoming", "baoming_activity", "baoming_form_template",
    "chinese_packages", "coupon", "delivery",
    "official_account_user", "payment", "pickup_code",
    "pickup_spots", "products", "public", "test", "user", "coupon_user"
];
function getDBCollection(db, name) {
    return db.collection(name);
}
exports.getDBCollection = getDBCollection;
exports.DeliveryState = ["待打包称重", "待报价", "待支付", "待发货", "运输中", "待配送至自提点", "已到达", "待选择取货时间"];
function assertIPackage(p) {
    console.assert(typeof p.tracking_number === 'string');
    console.assert(typeof p.content === 'string');
    console.assert(typeof p.note === 'string');
    console.assert(typeof p.weight === 'number' || p.weight === null);
}
exports.assertIPackage = assertIPackage;
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotImplementedError;
}(Error));
var ValueError = /** @class */ (function (_super) {
    __extends(ValueError, _super);
    function ValueError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ValueError;
}(Error));
