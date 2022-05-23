"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.main = void 0;
var wx_server_sdk_1 = __importDefault(require("wx-server-sdk"));
var my_library_1 = require("../../../miniprogram/my_library");
var Delivery_1 = require("../../../miniprogram/pages/getDelivery/Delivery");
wx_server_sdk_1["default"].init({
    env: wx_server_sdk_1["default"].DYNAMIC_CURRENT_ENV
});
var db = wx_server_sdk_1["default"].database();
var log = wx_server_sdk_1["default"].logger();
function main(event, context) {
    return __awaiter(this, void 0, void 0, function () {
        var pub, totalFee, wxContext, is_admin, response, res, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, Delivery_1.getDBCollection)(db, 'public').doc("287a53aa61adee4100ba68a821f0aae3").get()];
                case 1:
                    pub = _a.sent();
                    totalFee = 0;
                    if (event.currency === "JPY") {
                        totalFee = Math.ceil(parseInt(event.amount_to_pay) * pub.data.JPY_to_CNY);
                    }
                    else {
                        totalFee = parseInt(event.amount_to_pay);
                    }
                    return [4 /*yield*/, wx_server_sdk_1["default"].getWXContext()];
                case 2:
                    wxContext = _a.sent();
                    is_admin = (wxContext.OPENID === "onlNR5CLE8pj91ZhS1PkZaDv9OfU");
                    return [4 /*yield*/, (0, Delivery_1.getDBCollection)(db, 'payment').add({
                            // data 字段表示需新增的 JSON 数据
                            data: {
                                //delivery_id:event.delivery_id,
                                type: 1,
                                is_paid: false,
                                totalFee: totalFee,
                                currency: "CNY",
                                product_id: event.product_id,
                                sku_index: event.sku_index,
                                pick_up_spot: event.pick_up_spot,
                                miniprogram_open_id: wxContext.OPENID,
                                union_id: wxContext.UNIONID
                            }
                        })];
                case 3:
                    response = _a.sent();
                    return [4 /*yield*/, wx_server_sdk_1["default"].cloudPay.unifiedOrder({
                            body: "霓虹町指南-结算",
                            outTradeNo: response._id.toString(),
                            spbillCreateIp: "127.0.0.1",
                            subMchId: "1614594513",
                            totalFee: is_admin ? 100 : totalFee * 100,
                            envId: "testbai-6gjgkia55f6d4918",
                            functionName: "payDeliveryCallback",
                            nonceStr: (0, my_library_1.randomString)(),
                            tradeType: "JSAPI"
                        })];
                case 4:
                    res = _a.sent();
                    console.log("res", res);
                    return [2 /*return*/, { res: res, payment_id: response._id }];
                case 5:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [2 /*return*/, e_1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
