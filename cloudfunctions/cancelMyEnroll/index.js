// 云函数入口文件

const cloud = require('wx-server-sdk')

cloud.init({
  env: 'enroll-5gedsofoa021f2fb'
})

const db = cloud.database()
const _ = db.command


exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('myenroll').where({
        openid: wxContext.OPENID,
        status: true    
    }).remove()
  } catch(e) {
    console.error(e)
  }
}