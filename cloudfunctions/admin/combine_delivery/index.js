const cloud = require('wx-server-sdk');
const request = require("request-promise");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
const log = cloud.logger()
exports.main = async (event, context) => {
    try {
      let to_add_1 = await db.collection("delivery").doc("41ae62ef6215cf5108641b93047b5e5c").get() 
      let to_add_2 = await db.collection("delivery").doc("17e3426e62174a3e1074aeb754694602").get() 
      let target = await db.collection("delivery").doc("54ad1eea6219d32612fbd743437c5137").get() 
      let packages = to_add_1.data.packages
      let new_packages = target.data.packages
      for(let package of packages){
        new_packages.push(package)
      }
      packages = to_add_2.data.packages
      for(let package of packages){
        new_packages.push(package)
      }

    response = await db.collection("delivery").doc("54ad1eea6219d32612fbd743437c5137").update({
      data:{
        packages:new_packages
      }
    })
    console.log(packages)
    }catch(e){
      console.log(e)
    }
}