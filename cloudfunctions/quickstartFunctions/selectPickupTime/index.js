const cloud = require('wx-server-sdk');
const request = require("request-promise");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command

exports.main = async (event, context) => {
    try {        
        await db.collection('delivery').doc(event.id).update({
            data:{
                pickup_date:event.date,
                pickup_time:event.time
            }
        })

        return {
        success: true,
        }
    }catch (e) {
        return {
          success: false,
          data: 'failed to update pickup time'
        };
      }
}