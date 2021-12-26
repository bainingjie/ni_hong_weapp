// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const {parse} = require('csv-parse/sync');

// const parser = require('csv-parse/lib/sync');
/*　get access token。can be used multiple time before it expires. */ 

exports.main = async (event, context) => {
  try{
    let weight_file = await cloud.downloadFile({
      fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/weigth.csv'
    })
    const res = parse(weight_file.fileContent)
    res.shift();
    let weight_object={}
    for (row of res){
      let weight = Number(row[10]);
      if(weight != 0){
        weight_object[row[1]]=weight
      }
    }
    // console.log(weight_object)

    let deliveries = await db.collection("delivery").where({
      total_weight:"待称重"
    }).get()
    deliveries = deliveries.data
    for (let delivery of deliveries){
      let not_found_count=0;
      let is_weight_updated=false;
      for(let package of delivery.packages){
        if(package.weight==null){
          if(package.tracking_number in weight_object){
            is_weight_updated=true;
            package.weight = Number(weight_object[package.tracking_number])
          }else{
            not_found_count += 1;
            console.log("can't find the weight of", package.tracking_number)
          }
        }
      }

      let real_total_weight=0
      let total_weight = 0
      if(not_found_count == 0){
        for (let package of delivery.packages){
          // console.log(real_total_weight,package.weight)
          real_total_weight += package.weight
        }
        if((Math.ceil(real_total_weight)-real_total_weight)<0.5){
          total_weight = Math.ceil(real_total_weight)
        }else if ((Math.ceil(real_total_weight)-real_total_weight)>=0.5){
          total_weight = Math.floor(real_total_weight)+0.5
        }
      }
      // console.log(real_total_weight)
      // console.log(total_weight*30+4)
      if(is_weight_updated){
        await db.collection("delivery").doc(delivery._id).update({
          data: {
            packages:delivery.packages,
            real_total_weight:real_total_weight?real_total_weight:"待称重",
            total_weight:total_weight?total_weight:"待称重",
            state:total_weight?"待支付":"待打包称重",
            amount_to_pay:total_weight?total_weight*30+4:"待称重"
          }
        })
      }
    }

    return {
      state:"success"
    }
  }catch(e){
    console.log(e)
    return {
      state:"error"
    }
  }
}