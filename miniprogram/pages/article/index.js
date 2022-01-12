// miniprogram/pages/index/index.js
import Toast from '../../components/dist/toast/toast';
const db = wx.cloud.database()
const app = getApp()
Page({
    /**
     * 页面的初始数据 https://mp.weixin.qq.com/s/jTIpMGmNLs4qifpLBxqRfw
     */
    data: {
        data: [],
        show: false,
        src: "",
        name:"",
        loading: false,
        list: [],
        look:true,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let that = this;
        // if (wx.createRewardedVideoAd) {
        //     videoAd = wx.createRewardedVideoAd({
        //       adUnitId: 'adunit-a147c53de1e510bc'
        //     })
        //     videoAd.onLoad(() => {})
        //     videoAd.onError((err) => {})
        //     videoAd.onClose((res) => {
        //         if (res && res.isEnded) {
        //             // 正常播放结束，可以下发游戏奖励
        //             that.setData({
        //                 look: true,
        //                 show: true,
        //             })
        //         } else {
        //             // 播放中途退出，不下发游戏奖励
        //         }
        //     })
        //   }
    },
    showAdd(e) {
        // if (this.data.look) {
        //     this.setData({
        //         show: true,
        //     });
        //   } else {
        //     videoAd.show().catch(() => {
        //         // 失败重试
        //         videoAd.load()
        //           .then(() => videoAd.show())
        //           .catch(err => {
        //             console.log('广告显示失败')
        //             Toast.fail('你的账号无法使用...');
        //           })
        //       })
        //   }
        this.setData({
            show: true,
        });
    },
    onClose() {
        this.setData({
            show: false
        });
    },
    changeSrc(e) {
        this.setData({
            src: e.detail
        });
    },
    changeName(e) {
        this.setData({
            name: e.detail
        });
    },
    add() {
        this.setData({
            loading: true,
          })
        wx.cloud.callFunction({
            name: 'article_add',
            data: {
                info: {
                    username: app.globalData.userInfo.nickName,
                    src: this.data.src,
                    name:this.data.name,
                }
            },
            success:()=>{
                this.setData({
                    loading: false,
                    name:"",
                    src:""
                  })
                 this.getList()
            }
        })
    },
    getList() {
        db.collection('article').get().then(res => {
            const data=res.data.map((item)=>{
               return {
                id:item._id,
                name:item.name,
                src:item.src,
                label:`作者：${item.username}-----上传时间：${new Date(item.date).toLocaleString()}-----阅读数：${item.number}`,
               }  
            });
            this.setData({
                list:data
            })
        })
    },
    addLog(aid){
        wx.cloud.callFunction({
            name: 'log_add',
            data: {
                info: {
                   // username: app.globalData.userInfo.nickName,
                    aid,
                }
            },
            // success:()=>{
            //     this.setData({
            //         loading: false,
            //       })
            //      this.getList()
            // }
        })
    },
    jump(e) {
       const {dataset}=e.currentTarget;
        wx.navigateTo({
            url: `/pages/read/index?src=${dataset.src}`,
            // events: {
            //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            //   acceptDataFromOpenedPage: function(data) {
            //     console.log(data)
            //   },
            //   someEvent: function(data) {
            //     console.log(data)
            //   }
            // },
            success: (res)=> {
              // 通过eventChannel向被打开页面传送数据
              this.addLog(dataset.id)
            }
          })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTabBar().init();
        // if (!app.globalData.userInfo) {
        //     wx.switchTab({
        //         url: "/pages/user/index",
        //         complete: () => {
        //             Toast.fail('请先登录');
        //         }
        //     });
        //     return
        // }
        this.getList()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            look: false,
            show: false,
          })
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: this.data.msg.title,
            path: this.data.msg.path,
            imageUrl: this.data.msg.imageUrl,
        }
    }
})