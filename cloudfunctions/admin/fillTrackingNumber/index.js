// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const {parse} = require('csv-parse/sync');

// const parser = require('csv-parse/lib/sync');
/*　get access token。can be used multiple time before it expires. */ 

exports.main = async (event, context) => {
  let number = "EB758893632CN" 
  try{
    // let delivery_file = await cloud.downloadFile({
    //     fileID: 'cloud://testbai-6gjgkia55f6d4918.7465-testbai-6gjgkia55f6d4918-1308612466/test.csv'
    //   })
    // const res = parse(delivery_file.fileContent)
    // res.shift();
    // let ids =[]
    // // console.log(res)
    // for (row of res){
    //     // console.log(row[0])
    //     ids.push(row[0]);
    // }
    let ids =["bf4a0bf261c9645100c9645e5d376fb9","bf4a0bf261c9651300c99bf15e627e90","17e3426e61cd15f70177844838fe056f","bf4a0bf261cddcb4019834e156067def","17e3426e61cc2d7e01532ad2257357b9","17e3426e61cd4b4a018301040407a5ef","17e3426e61d0202d020893e66fcfbce9"]

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