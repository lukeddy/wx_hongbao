import{ lessonTmplId } from "../config/index"
const app = getApp()
function subscribe(fn) {
  //申请发送订阅消息
  wx.requestSubscribeMessage({
    // 传入订阅消息的模板id，模板 id 可在小程序管理后台申请
    tmplIds: [lessonTmplId],
    complete: res => {
      // 申请订阅成功
      if (res.errMsg === 'requestSubscribeMessage:ok') {
        // 这里将订阅的课程信息调用云函数存入云开发数据
        wx.cloud
          .callFunction({
            name: 'subscribe',
            data: {
              templateId: lessonTmplId,
              data: {
                thing1: {
                  value: "外卖红包"
                },
                thing3: {
                  value: "上午10点30分"
                }
              },
              userInfo: app.globalData.userInfo
            },
            complete: res => {
              fn(res)
            }
          })
      }
    },
  });
}

function  hasSubscribe(fn) {
  wx.cloud.callFunction({
      name: 'getSubscribeNumber',
      complete: res => {
          fn(res)
      }
  });
}

module.exports = {
  subscribe,
  hasSubscribe
}