// miniprogram/pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'userPhoto': '/images/user/user-unlogin.png',
    'nickName' : '小花猫',
    'logged' : false,
    'disabled' : true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.cloud.callFunction({
          name : 'login',
          data : {}
      }).then((res)=>{
        // console.log(res);
        db.collection('users').where({
          _openid : res.result._openid
        }).get().then((res)=>{
          if(res.data.length){
            app.userInfo = Object.assign(app.userInfo, res.data[0]);
            this.setData({
              userPhoto: app.userInfo.userPhoto,
              nickName: app.userInfo.nickName,
              logged: true
            });
          }else{
              this.setData({
                disabled : false
              });
          }
          
        });
      });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  bindGetUserInfo(ev){
      // console.log(ev);
      let userInfo = ev.detail.userInfo;
      /**
       * 未登录，且具备userInfo
       */
      if(!this.data.logged && userInfo){
          db.collection('users').add({
            data : {
              userPhoto : userInfo.avatarUrl,
              nickName : userInfo.nickName,
              signature : '',
              phoneNumber : '',
              weixinNumber : '',
              links : 0,
              time : new Date(),
              isLocation : true
            }
          }).then((res)=>{
            db.collection('users').doc(res._id).get().then((res)=>{
              //写入到全局app中
                app.userInfo = Object.assign(app.userInfo,res.data); 
                this.setData({
                  userPhoto : app.userInfo.userPhoto,
                  nickName : app.userInfo.nickName,
                  logged : true
                });
            });
          });
      }
  }
})