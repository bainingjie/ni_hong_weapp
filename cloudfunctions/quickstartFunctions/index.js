"use strict";
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
exports.__esModule = true;
exports.main = void 0;
// 云函数入口函数
var addDelivery = __importStar(require("./addDelivery/index"));
var addPhone = __importStar(require("./addPhone/index"));
var doNothing = __importStar(require("./doNothing/index"));
var getADelivery = __importStar(require("./getADelivery/index"));
var getCouponForUser = __importStar(require("./getCouponForUser/index"));
var getDelivery = __importStar(require("./getDelivery/index"));
var getPickUpSpot = __importStar(require("./getPickUpSpot/index"));
var getPickUpSpots = __importStar(require("./getPickUpSpots/index"));
var getProduct = __importStar(require("./getProduct/index"));
var getProducts = __importStar(require("./getProducts/index"));
var getPublicData = __importStar(require("./getPublicData/index"));
var payDelivery = __importStar(require("./payDelivery/index"));
var payTrade = __importStar(require("./payTrade/index"));
var selectPickupTime = __importStar(require("./selectPickupTime/index"));
var CloudFunctionEventTypes = [
    'addDelivery',
    'addPhone',
    'doNothing',
    'getADelivery',
    'getCouponForUser',
    'getDelivery',
    'getPickUpSpot',
    'getPickUpSpots',
    'getProduct',
    'getProducts',
    'getPublicData',
    'payDelivery',
    'payTrade',
    'selectPickupTime',
];
function main(event, context) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.assert(typeof event.type === 'string');
                    _a = event.type;
                    switch (_a) {
                        case 'addDelivery': return [3 /*break*/, 1];
                        case 'addPhone': return [3 /*break*/, 3];
                        case 'doNothing': return [3 /*break*/, 5];
                        case 'getADelivery': return [3 /*break*/, 7];
                        case 'getCouponForUser': return [3 /*break*/, 9];
                        case 'getDelivery': return [3 /*break*/, 11];
                        case 'getPickUpSpot': return [3 /*break*/, 13];
                        case 'getPickUpSpots': return [3 /*break*/, 15];
                        case 'getProduct': return [3 /*break*/, 17];
                        case 'getProducts': return [3 /*break*/, 19];
                        case 'getPublicData': return [3 /*break*/, 21];
                        case 'payDelivery': return [3 /*break*/, 23];
                        case 'payTrade': return [3 /*break*/, 25];
                        case 'selectPickupTime': return [3 /*break*/, 27];
                    }
                    return [3 /*break*/, 29];
                case 1: return [4 /*yield*/, addDelivery.main(event, context)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, addPhone.main(event, context)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, doNothing.main(event, context)];
                case 6: return [2 /*return*/, _b.sent()];
                case 7: return [4 /*yield*/, getADelivery.main(event, context)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9: return [4 /*yield*/, getCouponForUser.main(event, context)];
                case 10: return [2 /*return*/, _b.sent()];
                case 11: return [4 /*yield*/, getDelivery.main(event, context)];
                case 12: return [2 /*return*/, _b.sent()];
                case 13: return [4 /*yield*/, getPickUpSpot.main(event, context)];
                case 14: return [2 /*return*/, _b.sent()];
                case 15: return [4 /*yield*/, getPickUpSpots.main(event, context)];
                case 16: return [2 /*return*/, _b.sent()];
                case 17: return [4 /*yield*/, getProduct.main(event, context)];
                case 18: return [2 /*return*/, _b.sent()];
                case 19: return [4 /*yield*/, getProducts.main(event, context)];
                case 20: return [2 /*return*/, _b.sent()];
                case 21: return [4 /*yield*/, getPublicData.main(event, context)];
                case 22: return [2 /*return*/, _b.sent()];
                case 23: return [4 /*yield*/, payDelivery.main(event, context)];
                case 24: return [2 /*return*/, _b.sent()];
                case 25: return [4 /*yield*/, payTrade.main(event, context)];
                case 26: return [2 /*return*/, _b.sent()];
                case 27: return [4 /*yield*/, selectPickupTime.main(event, context)];
                case 28: return [2 /*return*/, _b.sent()];
                case 29: throw new Error("switch语法的index.js也需要增量上传。");
            }
        });
    });
}
exports.main = main;
// export async function CloudFunctionCall()
