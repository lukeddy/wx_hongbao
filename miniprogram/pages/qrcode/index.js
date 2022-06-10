let QRCode = require('../../utils/qrCode.js')
import Toast from '../../components/dist/toast/toast';
let videoAd = null
Page({
  data: {
    showLayerBox: false,
    qrCode: '',
    text: '这里输入内容',
    colorLight: '#fff',
    colorDark: '#000',
    colorTypeSel: 'colorLight',
    cp_cus: ['#000', '#fff', '#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'],
    cp_color: '',
    look: false,
    show: false,
  },

  onLoad: function () {

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
          this.code()
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }
  },
  bindText(e) {
    this.setData({
      text: e.detail.value
    })
  },

  code() {
    if (this.data.look) {
      let
        _this = this;
      _this.data.qrCode = new QRCode('canvas', {
        text: _this.data.text,
        width: '200',
        height: '200',
        colorLight: _this.data.colorLight,
        colorDark: _this.data.colorDark,
        correctLevel: QRCode.CorrectLevel.H
      })
      this.setData({
        show: true
      })
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

  },

  download() {
    if (this.data.qrCode) {
      this.data.qrCode.exportImage(function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res,
          success(ret) {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            })
          }
        })
      })
    } else {
      Toast.fail('无可下载的二维码...');
    }

  },

  showLayerBox(e) {
    let
      _this = this,
      pageData = Object.assign({}, _this.data),
      dataset = e.currentTarget.dataset,
      animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      });
    animation.opacity("1")
    animation.width("80%").step()
    pageData.animationData = animation.export();
    pageData.showLayerBox = true;
    pageData.colorTypeSel = dataset.type
    pageData.cp_color = pageData[dataset.type]
    _this.setData(pageData)
  },

  hideLayerBox() {
    let
      _this = this,
      pageData = Object.assign({}, _this.data),
      animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      });
    animation.opacity("0")
    animation.width("0").step()
    pageData.animationData = animation.export();
    pageData.showLayerBox = false
    _this.setData(pageData)
  },

  // 模块数据通讯
  color(e) {
    let
      _this = this,
      pageData = Object.assign({}, _this.data);
    pageData[pageData.colorTypeSel] = e.detail.color
    _this.setData(pageData)
    _this.code()
    _this.hideLayerBox()
  }
})