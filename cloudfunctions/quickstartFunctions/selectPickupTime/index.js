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
var request_promise_1 = __importDefault(require("request-promise"));
var Delivery_1 = require("../../../miniprogram/pages/getDelivery/Delivery");
wx_server_sdk_1["default"].init({
    env: wx_server_sdk_1["default"].DYNAMIC_CURRENT_ENV
});
var db = wx_server_sdk_1["default"].database();
var _ = db.command;
var log = wx_server_sdk_1["default"].logger();
function main(event, context) {
    return __awaiter(this, void 0, void 0, function () {
        var delivery_response, resData, text, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, Delivery_1.getDBCollection)(db, 'delivery').doc(event.id).get()];
                case 1:
                    delivery_response = _a.sent();
                    resData = { msgtype: "", text: { content: "" } };
                    if ("pickup_date" in delivery_response.data) {
                        text = "\u6709\u987E\u5BA2\u4FEE\u6539\u4E86\u53D6\u8D27\u65F6\u95F4~\ndelivery_id:".concat(event.id, "\n\u4FEE\u6539\u524D\uFF1A").concat(delivery_response.data.pickup_date, " ").concat(delivery_response.data.pickup_time, " \n\u4FEE\u6539\u540E\uFF1A").concat(event.date, " ").concat(event.time, " \n\u53D6\u8D27\u5730\u70B9\uFF1A").concat(delivery_response.data.pickup_spot, " \n\u53D6\u8D27\u7801\uFF1A ").concat(delivery_response.data.pickup_code, " \n");
                        resData.msgtype = "text";
                        resData.text.content = text;
                    }
                    else {
                        resData.msgtype = "text";
                        resData.text.content = "\u6709\u987E\u5BA2\u9009\u62E9\u4E86\u53D6\u8D27\u65F6\u95F4~\ndelivery_id:".concat(event.id, "\n\u53D6\u8D27\u65F6\u95F4\uFF1A").concat(event.date, " ").concat(event.time, " \n\u53D6\u8D27\u5730\u70B9\uFF1A").concat(delivery_response.data.pickup_spot, " \n\u53D6\u8D27\u7801\uFF1A ").concat(delivery_response.data.pickup_code, " \n");
                    }
                    return [4 /*yield*/, (0, Delivery_1.getDBCollection)(db, 'delivery').doc(event.id).update({
                            data: {
                                state: "待配送至自提点",
                                pickup_date: event.date,
                                pickup_time: event.time
                            }
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, request_promise_1["default"])({
                            url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify(resData)
                        })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, {
                            success: true
                        }];
                case 4:
                    e_1 = _a.sent();
                    log.error({
                        error: e_1
                    });
                    return [2 /*return*/, {
                            success: false,
                            data: "failed to update pickup time"
                        }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
