// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const {parse} = require('csv-parse/sync');

// const parser = require('csv-parse/lib/sync');
/*　get access token。can be used multiple time before it expires. */ 

exports.main = async (event, context) => {
  let number = "EB758547845CN" 
  try{
    let delivery_file = await cloud.downloadFile({
        fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/test.csv'
      })
    const res = parse(delivery_file.fileContent)
    res.shift();
    let ids =[]
    // console.log(res)
    for (row of res){
        // console.log(row[0])
        ids.push(row[0]);
    }
    for (id of ids){
        let delivery = await db.collection("delivery").doc(id).get()
        if(delivery.state="待发货"){
            console.log(id)
            let response = await db.collection("delivery").doc(id).update(
                {
                    data:{
                        state:"运输中",
                        tracking_number:number,
                        pickup_code:"待签收"
                    }
                })
            console.log(response)
        }
    }
    

  }catch(e){
    console.log(e)
  }
}