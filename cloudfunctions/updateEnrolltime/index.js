// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'enroll-5gedsofoa021f2fb'
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  // let {Begin,End}=event
  // console.log("Begin:"+Begin)
  // console.log(event)
  return await db.collection('enrolltime').where({
      enrollBegin: event.Begin,
      enrollEnd: event.End
    })
    .update({
      data: {
        number: _.inc(1),
        enable: true
      },
    })
  // return event.a+event.b
}