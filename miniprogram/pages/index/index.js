// pages/index/index.js
var times = require('../../utils/times')
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mglist: '',
        msgList: '',
        attention: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection("banner").get({
            success: res => {
                console.log(res)
                this.setData({
                    mglist: res.data
                })
            }
        })
        db.collection("notice").get({
            success: res => {
                console.log(res)
                this.setData({
                    msgList: res.data
                })
            }
        })
        db.collection("attention").get({
            success: res => {
                // console.log(res.data.length)
                for (var i = 0; i < res.data.length; i++) {
                    console.log(res.data[i]["_createTime"])
                    res.data[i]["_createTime"] = times.toDate(res.data[i]["_createTime"])
                }

                this.setData({
                    attention: res.data
                })
            }
        })
    },

    sjowbs: function (e) {
        console.log(e.currentTarget.id)
        wx.navigateTo({
            url: '../news/index?text_id=' + e.currentTarget.id,
        })

    },
    showlist: function (e) {
        wx.showTabBar({
           url: '../enroll/index'
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