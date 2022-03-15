// pages/myself/index.js
const db = wx.cloud.database()
var times = require('../../utils/times')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        userInfo: ''
    },

    getopenid() {
        var that = this;
        wx.cloud.callFunction({
            name: 'open',
            success: (res) => {
                var usid = res.result.openid
                console.log(usid)
                this.setData({
                    openid: res.result.openid,
                })
                getApp().globalData.openid = res.result.openid
                // db.collection("user").where({
                //     openid: res.result.openid
                // }).get().then(res => {
                //     console.log(res.data)
                //     this.setData({
                //         userInfo: res.data
                //     })
                //     if (res.data == '') {
                //         wx.navigateTo({
                //             url: '../getuser/getuser',
                //         })
                //     }
                //     wx.setStorageSync('userinfo', res.data)
                // })

                wx.setStorageSync('openid', res.result.openid)
            },
            fail(res) {
                console.log("获取失败", res);
            }
        })

        wx.getUserProfile({
            desc: '用于完善资料', //声明
            success: (res) => {
                this.setData({
                    userInfo: res.userInfo
                })
            },
            fail(res) {
                console.log('用户拒绝')
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        db.collection("config").get({
            success: res => {
                // console.log(res.data.length)
                for (var i = 0; i < res.data.length; i++) {
                    console.log(res.data[i]["beginTime"])
                    res.data[i]["beginTime"] = times.toDate(res.data[i]["beginTime"])
                    console.log(res.data[i]["beginTime"] + ":00")
                }


            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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

    }
})