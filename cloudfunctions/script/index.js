const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init({
    env: "hongbao-1g1vxdep2e9a4001"
  });
  const db = cloud.database();
  try {
    return await db.collection('messages').where({
      templateId: "WsI7r1v9d1hdKcWqT9cLmktb8CHGI8Rnfy4d6QlpGoc",
      send:false
    }).remove()
  } catch (e) {
    console.log(e)
  }
};