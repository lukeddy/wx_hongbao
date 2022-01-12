const cloud = require('wx-server-sdk');
cloud.init({
    env: "hongbao-1g1vxdep2e9a4001"
  });
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const {OPENID} = cloud.getWXContext();
    const userInfo=event.userInfo;
    // 在云开发数据库中存储订阅任务
    await db.collection('messages').add({
      data: {
        touser: OPENID, // 订阅者的openid
        page: 'pages/index/index', // 订阅消息卡片点击后会打开小程序的哪个页面
        data: event.data, // 订阅消息的数据
        templateId: event.templateId, // 订阅消息模板ID
        user: userInfo?userInfo.nickName:"", // 用户名字
        send:false,
        date:new Date().toLocaleString(),
      },
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};