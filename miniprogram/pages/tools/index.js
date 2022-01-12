import Toast from '../../components/dist/toast/toast';
const app = getApp()
let videoAd = null
Page({
    /**
     * 页面的初始数据
     */
    data: {
        url: "",
        videoUrl: "",
        loading: false,
        progress: 0,
        look: false,

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 在页面中定义激励视频广告
        const that = this;
        // 在页面onLoad回调事件中创建激励视频广告实例
        if (wx.createRewardedVideoAd) {
            videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-04e37f0625ceb8e0'
            })
            videoAd.onLoad(() => {
                console.log('videoAd event onLoad')
            })
            videoAd.onError((err) => {
                console.log('videoAd event onError', err)
            })
            videoAd.onClose((res) => {
                if (res && res.isEnded) {
                    // 正常播放结束，可以下发游戏奖励
                    that.setData({
                        look: true,
                    })
                    that.gowm();
                } else {
                    // 播放中途退出，不下发游戏奖励
                }
            })
        }
        // 用户触发广告后，显示激励视频广告

    },
    write(e) {
        this.setData({
            url: e.detail
        })
    },
    gowm() {
        this.setData({
            loading: true,
        })
        wx.cloud.callFunction({
            name: 'gowm',
            data: {
                url: this.data.url
            },
            success: res => {
                if (res.result) {
                    this.setData({
                        videoUrl: res.result.fileID,
                        look: false,
                    })
                }
            },
            fail: err => {
                Toast('提取失败，检查链接');
            },
            complete:()=>{
                this.setData({
                    loading: false,
                })
            }
        })
    },
    do() {
        if (this.data.url) {
            if (this.data.look) {
                this.gowm();
            } else {
                if (videoAd) {
                    videoAd.show().catch(() => {
                        // 失败重试
                        videoAd.load()
                            .then(() => videoAd.show())
                            .catch(err => {
                                console.log(err)
                                console.log('激励视频 广告显示失败')
                                Toast.fail('你的账号无法使用...');
                            })
                    })
                }
            }
        } else {
            Toast('请先输入链接');
        }
    },
    save(e) {
        this.setData({
            loading: true,
        })
        const downloadTask = wx.cloud.downloadFile({
            fileID: this.data.videoUrl,
            success: res => {
                wx.saveVideoToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: (res) => {
                        this.setData({
                            loading: false,
                        });
                        Toast('保存成功');
                    },
                    fail: (err) => {
                        console.log(err)
                        this.setData({
                            loading: false,
                        })
                        Toast('保存失败');
                    }
                })
            },
            fail: err => {
                console.log(111, err)
                this.setData({
                    loading: false,
                })
            }
        })
        downloadTask.onProgressUpdate((res) => {
            console.log('下载进度', res.progress)
            this.setData({
                progress: res.progress,
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成 https://v.douyin.com/e5KPUNB/
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTabBar().init();
        if (!app.globalData.userInfo) {
            wx.switchTab({
                url: "/pages/user/index",
                complete: () => {
                    Toast.fail('请先登录');
                }
            });
            return
        }
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
        wx.cloud.downloadFile({
            fileID: this.data.videoUrl,
            success: res => {
              // get temp file path
              console.log(res.tempFilePath)
            },
            fail: err => {
              // handle error
            }
          })
          this.setData({
            videoUrl:"",
          })
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