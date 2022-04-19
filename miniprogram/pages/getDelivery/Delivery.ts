// import * as cloud from 'wx-server-sdk';
// const db = cloud.database();
import type {DB} from 'wx-server-sdk';
import type {main as getDelivery} from '../../../cloudfunctions/quickstartFunctions/getDelivery/index'
export const ALL_JAPAN_PREFECTURES = ["北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
	"茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
	"新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
	"静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
	"奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
	"徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
	"熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"] as const;
export type JAPAN_PREFECTURE_TYPE = typeof ALL_JAPAN_PREFECTURES[number];


const db_collection_names = [
	"baoming", "baoming_activity", "baoming_form_template",
	"chinese_packages", "coupon", "delivery",
	"official_account_user", "payment", "pickup_code",
	"pickup_spots", "products", "public", "test", "user", "coupon_user"
] as const;

export function getDBCollection<T extends DB.IDocumentData>(db: DB.Database, name:typeof db_collection_names[number]){
	return db.collection<T>(name);
}
export interface IPickupSpot extends DB.IDocumentData {
	address: {
		postcode: string;
		prefecture: JAPAN_PREFECTURE_TYPE;
		住所: string;
		google_maps_url: string;
		name_of_person_in_charge: string;
		phone_number: string;
	}
	name: string;
}

const DeliveryState = ["待打包称重", "待报价", "待支付", "待发货", "运输中", "待配送至自提点", "已到达"] as const;
type DeliveryState = typeof DeliveryState[number];

export interface IPackage {
	tracking_number: string;
	content: string;
	note: string;
	weight: number | null;
}
export function assertIPackage<T extends IPackage>(p: T){
	console.assert(typeof p.tracking_number === 'string');
	console.assert(typeof p.content === 'string');
	console.assert(typeof p.note === 'string');
	console.assert(typeof p.weight === 'number' || p.weight === null);
}
export interface IDelivery extends DB.IDocumentData {
	added_date: Date;
	amount_to_pay: "待称重" | number;
	is_pickup_message_sent: boolean;
	is_pickup_remind_sent: boolean;
	is_quote_message_sent: boolean;
	packages: Array<IPackage>;
	phone: string;
	pickup_code: string;
	pickup_spot: string | IPickupSpot;
	pickup_date?: string;
	pickup_time?: string
	remark: string;
	state: DeliveryState;
	tracking_number: string;
	type: 0 | 1;
	total_weight: "待称重" | number;
	union_id: string;
	open_id: string;
}
export interface IPayment extends DB.IDocumentData {
	totalFee?: number;
}

export type ICoupon = DB.IDocumentData & ({
	readonly type: "满减";
	readonly 满: number;
	readonly 减: number;
} | {
	readonly type: "折扣";
	readonly percent: number;
})
export interface IUser extends DB.IDocumentData {
	readonly miniprogram_open_id: string ;
	readonly union_id: string ;
	official_account_open_id: string|null;
}
export interface IProduct extends DB.IDocumentData{
	is_active: boolean;
	start_index: number;
	sku: any[];
	text:{
		card_description: string;
		name: string;
		subtitle: string;
		url_title: string;
	}
}
export interface IPublic extends DB.IDocumentData {
	JPY_to_CNY: number;
	address: string;
	address1: string;
	address2: string;
	address3: string;
	address4: string;
	delivery_day: string;
	description_2_1: string;
	description_2_2: string;
	enter_official_account: string;
	opponent_head_500g: number;
	opponent_price_500g: number;
	pay_day: string;
	price: string;
	price_500g: number
	product_delivery: string
	share_title: string
	weight_example: string
}

export interface ICouponUser extends DB.IDocumentData {
	readonly coupon_id: DB.DocumentId;
	readonly open_id: DB.DocumentId;
	readonly available_until: Date;
	readonly state: "未使用" | "已使用" | "已过期" | "已作废"
	count:number;
}
class NotImplementError extends Error {
}
class ValueError extends Error {
}
const callQuickstartFunction:typeof getDelivery = (event, context)=> {
	
}