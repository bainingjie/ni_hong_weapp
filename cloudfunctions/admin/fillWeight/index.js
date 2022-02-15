// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const {parse} = require('csv-parse/sync');
const _ = db.command;

// const parser = require('csv-parse/lib/sync');
/*　get access token。can be used multiple time before it expires. */ 

exports.main = async (event, context) => {
  try{
    let weight_file = await cloud.downloadFile({
      fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/weight.csv'
    })
    const res = parse(weight_file.fileContent)
    console.log(res)
    res.shift();

    // id,weight,content,price,state 
    // state:0,1(delivered)

    // let packages = await db.collection("chinese_packages").where({
    //   state: 0,
    // }).get()
    const MAX_LIMIT = 100;
    // 先取出集合记录总数
    const countResult = await db.collection('chinese_packages').count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
        const promise = db.collection("chinese_packages").skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        tasks.push(promise)
    }
    // 等待所有
    let promise_response = (await Promise.all(tasks)).reduce((acc, cur) => {
        return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
        }
    })


    let packages = promise_response.data
    console.log(packages)
    let weight_object={}
    let file_packages=[]
    for (row of res){
      if(row[0].length>5){
        
        let weight = Number(row[9]);
        if(weight != 0){
          weight_object[row[0]]=weight
        }
        // check existance 
        // なぜか重複追加される
        let exist = packages.find(package => {
          if (package.tracking_number == row[0]){
            return true
         }else{
           return false
         }
        });
        if(!exist && (Number(row[9])>0)){
          // console.log(exist,row[0])
          let package = {}
          package.tracking_number = row[0]
          package.weight = Number(row[9])
          package.state = 0
          package.content = row[5]
          package.unit_price = row[7]
          package.number =  row[6]
          await db.collection('chinese_packages').add({
            data: package
          })
        }
      }
    }

    // let weight_object=[]

    console.log(weight_object)

    let deliveries = await db.collection("delivery").where({
      union_id: _.not(_.eq("o9mwV6KEtsjhOWbqGas2BnhZqzGc")),
      /* total_weight:"待称重" */
      state: _.not(_.eq("已配送")),
    }).get()


    deliveries = deliveries.data
    console.log(deliveries)
    let price_response = await db.collection("public").doc("287a53aa61adee4100ba68a821f0aae3").get();

    for (let delivery of deliveries){
      let not_found_count=0;
      let is_weight_updated=false;
      for(let package of delivery.packages){
        if(package.weight==null){
          if(package.tracking_number in weight_object){
            is_weight_updated=true;
            package.weight = weight_object[package.tracking_number].toFixed(2);
          }else{
            not_found_count += 1;
            console.log("NOT FOUND:",package.tracking_number)
          }
        }
      }

      let real_total_weight=0
      let total_weight = 0
      if(not_found_count == 0){
        for (let package of delivery.packages){
          // console.log(real_total_weight,package.weight)
          real_total_weight += Number(package.weight)
        }
        real_total_weight = Number(real_total_weight).toFixed(2)

        if(real_total_weight<0.5){
          total_weight = 0.5
        }else if((real_total_weight-Math.floor(real_total_weight))<0.1){
          total_weight = Math.floor(real_total_weight)
        }else if((Math.ceil(real_total_weight)-real_total_weight)<0.5){
          total_weight = Math.ceil(real_total_weight)
        }else if ((Math.ceil(real_total_weight)-real_total_weight)>=0.5){
          total_weight = Math.floor(real_total_weight)+0.5
        }
      }


      // console.log(real_total_weight)
      // console.log(total_weight*30+4)

  
      if(is_weight_updated){
        console.log(delivery._id)
        await db.collection("delivery").doc(delivery._id).update({
          data: {
            packages:delivery.packages,
            real_total_weight:real_total_weight?real_total_weight:"待称重",
            total_weight:total_weight?total_weight:"待称重",
            state:total_weight?"待支付":delivery.state,
            amount_to_pay:total_weight?total_weight*price_response.data.price_500g*2+4:"待称重"
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