// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'enroll-5gedsofoa021f2fb'
})

const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    return await db.collection('myenroll').where({
        openid: wxContext.OPENID,
    }).get()
}