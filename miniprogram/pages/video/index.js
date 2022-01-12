// miniprogram/pages/index/index.js
import Toast from '../../components/dist/toast/toast';
const app = getApp()
let player;
let videoAd = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    look:false

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    player = wx.createVideoContext("video1");
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-04e37f0625ceb8e0'
      })
      videoAd.onLoad(() => {
        if (videoAd) {
          console.log('you激励视频 广告加载成功')
         // videoAd.show().catch(() => {})
      }
    })
      videoAd.onError((err) => {})
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          that.setData({
            look:true
          })
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
  },
  play() {
    console.log(this.data.look)
    if(this.data.look){
      player.play();
    }else{
      player.stop()
      videoAd.show();
    }
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
  onShow: function () {
    
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