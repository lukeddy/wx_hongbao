const cloud = require('wx-server-sdk');
cloud.init({
  env: "hongbao-1g1vxdep2e9a4001"
});
const db = cloud.database();
const _ = db.command
exports.main = async (event, context) => {
  try {
    const {
      OPENID
    } = cloud.getWXContext();
    const info = event.info;
    const {
      aid
    } = info;
    const query = await db.collection('log').where({
      aid
    })
    const log = await query.get()
    const temp = log.data[0];
    let number = 0;
    if (temp) {
      await query.update({
        data: {
          // 表示指示数据库将字段自增 1
          number: _.inc(1)
        },
      })
    } else {
      await db.collection('log').add({
        data: {
          ...info,
          touser: OPENID, // 订阅者的openid
          number: 1
        },
      });
      number = 1;
    }
    await db.collection('article').doc(aid).update({
      data: {
        number: _.inc(number)
      }
    })
    // 
  } catch (err) {
    console.log(err);
    return false;
  }
};