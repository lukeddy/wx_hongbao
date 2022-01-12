// miniprogram/pages/index/index.js
const db = wx.cloud.database()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '步骤一',
        desc: '去抖音获取视频的分享链接',
      },
      {
        text: '步骤二',
        desc: '截取视频链接，如https://v.douyin.com/e5KPUNB/',
      },
      {
        text: '步骤三',
        desc: '取链接放进输入框里，点击提取',
      },
      {
        text: '步骤四',
        desc: '保存视频到相册',
      },
    ],
    activeNames: '1',
    url:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getinfo()
  },

  onChange(event) {
    console.log(event.detail)
    this.setData({
      activeName: event.detail,
    });
  },
  getinfo(){
    db.collection('shop').get().then(res => {
      const shop = res.data;
      if (shop[0]) {
        this.setData({
          url: shop[0].text
        })
      console.log(shop[0].text)

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //  console.log(this.data.src)
    //  this.setData({
    //   src:this.data.src
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // console.log("onShow",options)
    // const {src}=options;
    // this.setData({
    //   src
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})