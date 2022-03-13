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
      let result = await db.collection("delivery").doc("54ad1eea62171692129bb9f05bca8cc5").get() 
      let packages = result.data.packages
      packages.push({
          tracking_number:"YT2204288696220",
          content:"",
          note:"",
          weight:null
      })
      packages.push({
        tracking_number:"YT3189901123630",
        content:"",
        note:"",
        weight:null
    })
    packages.push({
      tracking_number:"432407103925282",
      content:"",
      note:"",
      weight:null
  })
  packages.push({
    tracking_number:"YT6329027271750",
    content:"",
    note:"",
    weight:null
})
    response = await db.collection("delivery").doc("54ad1eea62171692129bb9f05bca8cc5").update({
      data:{
        packages:packages
      }
    })
    console.log(packages)
    }catch(e){
      console.log(e)
    }
}