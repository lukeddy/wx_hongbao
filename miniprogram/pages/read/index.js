// miniprogram/pages/index/index.js
import {
  subscribe,
  hasSubscribe
} from "../../utils/index"
import Toast from '../../components/dist/toast/toast';
const db = wx.cloud.database()
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    src: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      src
    } = options;
    console.log(src)
    this.setData({
      src
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