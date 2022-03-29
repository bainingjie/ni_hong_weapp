const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // todo: 更新取件时间
  // let tokyo_time = new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
  // tokyo_time = new Date(tokyo_time)
  // tokyo_time.getDay()
  function dayConverter(day) {
    switch (day) {
      case 0:
        return "日"
      case 1:
        return "月"
      case 2:
        return "火"
      case 3:
        return "水"
      case 4:
        return "木"
      case 5:
        return "金"
      case 6:
        return "土"
      default:
        console.log(`error : day is out of range`);
    }
  }

  let delivery = await db.collection('delivery').where({
    _id:event._id
  }).get();

  //todo: check 是否包邮到家
  let pickup_spot = await db.collection('pickup_spots').where({
    name:delivery.data[0].pickup_spot
  }).get();

  delivery = delivery.data[0];
  pickup_spot = pickup_spot.data[0]
  let time_object = pickup_spot.time_object

  /* start */
        
  let tokyo_time = new Date().toLocaleString("ja-JP",{ timeZone: 'Asia/Tokyo' })
  let print_tokyo_time1 = tokyo_time 
  tokyo_time = new Date(tokyo_time)
 
  /* CUSTOMIZE */

  switch (pickup_spot.name) {
    case "四条・迷雾Space剧本研究所":
      tokyo_time = tokyo_time.setDate(tokyo_time.getDate() + 1);
      tokyo_time = new Date(tokyo_time)
      // time_object[1]=["19:00-21:00","21:00-24:00"]
      break; 
    default:
      // time_object[5]=["17:30-20:00"]
      /*最早显示次日的时间*/
      if(tokyo_time.getHours()>8){
        tokyo_time = tokyo_time.setDate(tokyo_time.getDate() + 1);
        tokyo_time = new Date(tokyo_time)
        time_object[1]=["17:00-20:00"]
      }
  }



  /* 星期的array */ 
  let tokyo_day = tokyo_time.getDay()
  let day_array = []
  for(let i = 0;i<7; i++){
    day_array.push((tokyo_day+i)%7)
  }
 
  /* 日期的array */ 
  let date_array = []
  let date_day_object = {}
  let temp_date = null
  for(let i = 0;i<7; i++){
    temp_date = String(tokyo_time.getMonth()+1)+"月"+String(tokyo_time.getDate())+"日"+"("+dayConverter(day_array[i])+")"
    date_array.push(temp_date)
    date_day_object[temp_date] = day_array[i]
    // console.log(date_array)
    tokyo_time = tokyo_time.setDate(tokyo_time.getDate() + 1);
    tokyo_time = new Date(tokyo_time)
  }
  



  // if(pickup_spot.pickup_spot=="四条・迷雾Space剧本研究所"){
  //   time_object[1]
  // }else{

  // }

  let temp = time_object[day_array[0]]
  let col = [
      {
        values: date_array,
        className: 'column1',
      },
      {
        values: temp,
        className: 'column2',
        defaultIndex: 0,
      },
    ];

  return {
    delivery: delivery,
    time_object:time_object,
    columns:col,
    date:(date_array[0]),
    time:(time_object[day_array[0]][0]),
    date_day_object:date_day_object
  }
};