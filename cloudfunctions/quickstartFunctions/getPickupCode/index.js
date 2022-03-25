const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // get union_id
  const wxContext = await cloud.getWXContext();
  let id = wxContext.OPENID
  console.log(wxContext)
  // id="o9mwV6McWClSZSD7EDXrVPYSU8X4"
  //retrieve code
  let response = await db.collection('pickup_code').where({
    open_id:id
  }).get();
  let pickup_code = ""
  if(response.data.length>0){
    return {code:response.data[0].pickup_code}
  }else{
    //create new code
    let id_length = id.length;
    let dic = [48,49,50,51,52,53,54,55,56,57,
               65,66,67,68,69,70,71,72,73,74,
               75,76,77,78,79,80,81,82,83,84,
               85,86,87,88,89,90]


    for (let i = id_length-1;i>id_length-13;i=i-3){
      let sum = 0
      for (let j = 0;j<3;j++){
        sum += id.charCodeAt(i-j)
        console.log("at:",i-j)
      }
      console.log("---------")
      console.log("sum:",sum,sum%36,String.fromCharCode(dic[sum%36]))
      pickup_code += String.fromCharCode(dic[sum%36])
    }
    //check existance
    response = await db.collection('pickup_code').where({
      pickup_code:pickup_code
    }).get();
    while(response.data.length>0){
      pickup_code = ""
      for (let j = 0;j<4;j++){
        pickup_code += String.fromCharCode(dic[Math.floor(Math.random() * 36)])
      }      
      response = await db.collection('pickup_code').where({
        pickup_code:pickup_code
      }).get();
    }
    //save
    await db.collection('pickup_code').add({
      data: {
        open_id: id,
        pickup_code:pickup_code
      }
    })
  }

  //return code
  return {code:pickup_code}
  // return await db.collection('public').doc('287a53aa61adee4100ba68a821f0aae3').get();
};
