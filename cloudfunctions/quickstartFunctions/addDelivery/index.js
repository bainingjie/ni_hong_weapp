"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var cloud = __importStar(require("wx-server-sdk"));
var request_promise_1 = __importDefault(require("request-promise"));
var Delivery_1 = require("../../../miniprogram/pages/getDelivery/Delivery");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
var db = cloud.database();
var _ = db.command;
function main(event, context) {
    return __awaiter(this, void 0, void 0, function () {
        var log, wxContext, open_id, union_id, user_db, user, _i, _a, detail, data, add_response, response, resData, group_resp, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log = cloud.logger();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    wxContext = cloud.getWXContext();
                    open_id = wxContext.OPENID;
                    union_id = wxContext.UNIONID;
                    user_db = (0, Delivery_1.getDBCollection)(db, 'user');
                    console.assert("OPENID" in wxContext);
                    console.assert("UNIONID" in wxContext);
                    console.assert(wxContext.OPENID !== undefined);
                    console.assert(wxContext.UNIONID !== undefined);
                    if (open_id === undefined)
                        throw new Error("wxContext.OPENID === undefined");
                    if (union_id === undefined)
                        throw new Error("wxContext.UNIONID === undefined");
                    return [4 /*yield*/, user_db
                            .where({
                            miniprogram_open_id: _.eq(open_id)
                        })
                            .get()];
                case 2:
                    user = _b.sent();
                    // console.log(user);
                    console.assert(typeof user === 'object');
                    if (!(user.data.length === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, user_db.add({
                            // data 字段表示需新增的 JSON 数据
                            data: {
                                // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                                miniprogram_open_id: open_id,
                                union_id: union_id,
                                official_account_open_id: null
                            }
                        })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    // let data_array: IPackage[] = [];
                    for (_i = 0, _a = event.shipping_details; _i < _a.length; _i++) {
                        detail = _a[_i];
                        console.assert(typeof detail === 'object');
                        console.assert(typeof detail.tracking_number === 'string');
                        console.assert(typeof detail.content === 'string');
                        console.assert(typeof detail.note === 'string');
                    }
                    data = {
                        type: 0,
                        open_id: open_id,
                        union_id: union_id,
                        added_date: new Date(),
                        pickup_spot: event.pickup_spot,
                        packages: event.shipping_details,
                        phone: event.phone,
                        state: "待打包称重",
                        is_quote_message_sent: false,
                        is_pickup_message_sent: false,
                        is_pickup_remind_sent: false,
                        tracking_number: "待发货",
                        pickup_code: "待到达",
                        total_weight: "待称重",
                        amount_to_pay: "待称重",
                        remark: ""
                    };
                    return [4 /*yield*/, (0, Delivery_1.getDBCollection)(db, 'delivery').add({
                            // data 字段表示需新增的 JSON 数据
                            data: __assign({}, data
                            // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                            // payment_id
                            )
                        })];
                case 5:
                    add_response = _b.sent();
                    if (add_response === undefined || typeof add_response === 'string')
                        throw new TypeError("add_response=".concat(add_response));
                    return [4 /*yield*/, (0, Delivery_1.getDBCollection)(db, 'public').doc('287a53aa61adee4100ba68a821f0aae3').get()];
                case 6:
                    response = _b.sent();
                    resData = {
                        "msgtype": "text",
                        "text": {
                            "content": "\u6709\u5BA2\u6237\u7533\u8BF7\u4E86\u96C6\u8FD0\ndelivery_id:".concat(add_response._id)
                        }
                    };
                    return [4 /*yield*/, (0, request_promise_1["default"])({
                            url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
                            method: "POST",
                            headers: {
                                "content-type": "application/json"
                            },
                            body: JSON.stringify(resData)
                        })];
                case 7:
                    group_resp = _b.sent();
                    console.log(group_resp);
                    // let new_promise = new Promise((resolve, reject) => {
                    //   try {
                    //     request({
                    //       method: 'POST',
                    //       headers: {
                    //         "content-type": "application/json",
                    //       },
                    //       body: JSON.stringify(resData),
                    //       url:  "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=182aec95-9e36-4f6b-9fb4-2087d5f31dca",
                    //     }, function (error, response, body) {
                    //       if (error) {
                    //         return reject(error);
                    //       }
                    //       return resolve(JSON.parse(body));
                    //     })
                    //   } catch (e) {
                    //     return reject(e)
                    //   }
                    // });
                    // await new_promise;
                    return [2 /*return*/, {
                            success: true,
                            official_account_url: response.data.enter_official_account
                        }
                        // return await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
                    ];
                case 8:
                    e_1 = _b.sent();
                    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
                    return [2 /*return*/, {
                            success: false,
                            data: 'create collection failed'
                        }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
