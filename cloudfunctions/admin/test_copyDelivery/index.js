
const cloud = require('wx-server-sdk')
const db = cloud.database();
cloud.init()
exports.main = async (event, context) => {
    let delivery = await db.collection("delivery").doc("bf4a0bf261c6e436007396181deeb7b3").get()
    delivery = delivery.data
    console.log(typeof(delivery))
    delete delivery._id 
    console.log(delivery)
    await  db.collection("delivery").add(
        {
            data:delivery
        }
    )
}