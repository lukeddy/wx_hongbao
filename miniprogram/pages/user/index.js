// miniprogram/pages/index/index.js
import Toast from '../../components/dist/toast/toast';
import {
  subscribe,
  hasSubscribe
} from "../../utils/index"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserProfile')
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    console.log(app.globalData.userInfo)
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo;
        this.addUser()
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    app.globalData.userInfo = e.detail.userInfo;
  },
  onShow: function () {
    this.getTabBar().init();
  },
  addUser() {
    wx.cloud.callFunction({
      name: 'addUser',
      data: {
        userInfo: app.globalData.userInfo
      },
    })
  },
  getHongbao() {
    wx.navigateToMiniProgram({
      appId: "wxfafc40d8f0d823c6",
      path: "pages/index/index",
      success(res) {
        // 打开成功
        console.log('打开成功', res)
      }
    })
  },
  getPhoto() {
    wx.navigateToMiniProgram({
      appId: "wx063f19ef77a02564",
      path: "pages/index/index",
      success(res) {
        // 打开成功
        console.log('打开成功', res)
      }
    })
  },
  requestSubscribe() {
    if (!app.globalData.userInfo) {
      Toast.fail('请先登录');
      return
    }
    hasSubscribe(res => {
      if (res.result) {
        Toast.success('已经订阅成功了');
      } else {
        subscribe(res => {
          if (res.result === true) {
            Toast.success('订阅成功');
          } else {
            Toast.fail('订阅失败');
          }
        });
      }
    })
    //申请发送订阅消息
  },
})