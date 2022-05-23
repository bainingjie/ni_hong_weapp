const assert = (condition:boolean) => {
    if (!condition) {
        throw new Error("Assertion Failed");
    }
}
class Coupon{
	_id:string;
	user_id: string;
	a:number;
	b:number;
	threshold:number;
	constructor(_id:string, user_id: string, a?:number=1, b?: number=0,threshold?:number=0) {
		this._id=_id;
		this.user_id=user_id;
		this.a=a||1;
		assert(0<=this.a&&this.a<=1);
		this.b=b||0;
		this.threshold=threshold||0;
		assert(this.threshold>=0);
	}
	apply(price:number):number{
		if(price>=this.threshold){
			return this.a*price+this.b;
		}
		return price;
	}
}