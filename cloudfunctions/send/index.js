const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init({
    env: "hongbao-1g1vxdep2e9a4001"
  });
  const db = cloud.database();
  try {
    // 从云开发数据库中查询等待发送的消息列表
    const messages = await db.collection('messages')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      .where({
       send: false,
      })
      .get();
      console.log(messages)
    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
         db
          .collection('messages')
          .doc(message._id)
          .update({
            data: {
              send: true,
            },
          });
      } catch (e) {
        return e;
      }
    });
    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
};