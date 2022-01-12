// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios');
const request = require('request');
cloud.init({
  env: "hongbao-1g1vxdep2e9a4001"
});
cloud.init()
const userAgent =
  'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Mobile Safari/537.36';
async function getDate(url, type) {
  const option = {
    url,
    method: 'get',
    headers: {
      'user-agent': userAgent,
    },
  };
  if (type) {
    option.responseType = type;
  }
  return axios(option);
}
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {
      OPENID
    } = cloud.getWXContext();
    const url = event.url;
    // 在云开发数据库中存储订阅任务
    const watermark = await new Promise(async (resolve, reject) => {
      request(url, (error, response, body) => {

        if (!error && response.statusCode == 200) {
          const href = response.request.href;
          let id;
          try {
            console.log("href", href)
            //id = href.match(/video\/(\S*)\/\?region/)[1];
            const temp1 = href.split("?")
            const temp2 = temp1[0].split("/");
            id = temp2[temp2.length - 1]
          } catch (error) {
            // res.json(send)
            console.log(222, id)
            reject(false)
          }
          resolve(`https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${id}`);
        } else {
          reject(false)
        }
      })
    });

    if (!watermark) {
      return false;
    }
    return await new Promise(async resolve => {
      request(watermark, async (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let result = JSON.parse(body);
          let data = result.item_list[0];
          //视频url解析
          const remp = data['video']["play_addr"]["url_list"][0];
          const videourl = remp.replace(/wm/g, '');
          const {
            data: videoStream
          } = await getDate(videourl, 'stream');
          const res = await cloud.uploadFile({
            cloudPath: `video/${OPENID}/${new Date().getTime()}.mp4`,
            fileContent: videoStream,
          })
          resolve(res)
        } else {
          resolve(false)
        }
      })
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}