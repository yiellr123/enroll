// pages/myself/index.js
const db = wx.cloud.database()
// var times = require('../../utils/times')
var dates = require('../../utils/dates')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        userInfo: '',
        messageList: [{
            status: false
        }, {
            status: true
        }, {
            status: false
        }, {
            status: false
        }, {
            status: false
        }, ],
        showHis: false,
        showMy_item: false,
        myEnrollBegin:'',
        myEnrollEnd:'',

        myEnrollData:'',
        hisEnrollData:'',
        place:''
    },

    // 展示我的预约界面
    onMyEnroll(e) {
        console.log(e)
        // var tempPlace=this.data.place
        this.setData({
            showHis: false
        })
        db.collection('myenroll').where({
            openid:this.data.openid,
            status:true
        }).get().then(res=>{
            if(res.data.length!=1){
                console.log("查询到'我的预约'数量错误")
                wx.showModal({
                    title: '提示',
                    content: '您当前没有进行中的预约',
                    showCancel:false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })
            }else{
                this.setData({
                    myEnrollData:res.data[0],
                    myEnrollBegin:res.data[0].myBeginTime,
                    myEnrollEnd:res.data[0].myEndTime,
                    showMy_item:true
                })
                
            }
        })
    },

    //展示历史预约
    onHistory(e) {
        this.setData({
            showHis: true
        })
        db.collection('myenroll').where({
            openid:this.data.openid,
            status:false
        }).get().then(res=>{
            console.log(res)
            this.setData({
                hisEnrollData:res.data,
                // myEnrollBegin:res.data[0].myBeginTime,
                // myEnrollEnd:res.data[0].myEndTime,
            })
        })
    },


    getopenid() {
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

    onCancel(e) {
        console.log(e)
        var tempBegin=this.data.myEnrollBegin
        var tempEnd=this.data.myEnrollEnd
        wx.showModal({
            title: '提示',
            content: '是否确认取消预约',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    //删除我的预约
                    wx.cloud.callFunction({
                        name: 'cancelMyEnroll'
                    }).then(res=>{
                        console.log(res)
                        //更新enrolltime表
                        // db.collection('enrolltime').where({
                        //     enrollBegin:this.data.myEnrollBegin,
                        //     enrollEnd:this.data.myEnrollEnd,
                        // }).get().then(res=>{
                        // })
                        console.log("tempBegin"+tempBegin)
                        wx.cloud.callFunction({
                            name:'updateEnrolltime',
                            data:{
                            //不能用this.data.myEnrollBegin
                            Begin: tempBegin,
                            End: tempEnd,
                            }
                        }).then(res=>{
                            console.log("云函数调用成功 begin: ")
                            console.log(res)

                        })
                    })
                    wx.showModal({
                        title: '提示',
                        content: '您已成功取消预约',
                        showCancel:false,
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                    this.setData({
                        showMy_item:false
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    // wx.cloud.callFunction({
    //     name: 'getMyEnroll',
    //     success: (res) => {

    //         this.setData({
    //             openid: res.result.openid,
    //         })
    //         console.log("在commit处设置openid: is " + this.data.openid)
    //     }
    // })

    /**
     * 生命周期函数--监听页面加载
     */

    onLoad: function (options) {
        wx.cloud.callFunction({
            name: 'open',
            success: (res) => {
                var usid = res.result.openid
                console.log(usid)
                this.setData({
                    openid: res.result.openid,
                })
                getApp().globalData.openid = res.result.openid
            }
        })

        //更新过期的预约状态
        wx.cloud.callFunction({
            name: 'getMyEnroll'
        }).then(res => {
            console.log(res)
            var nowTime = dates.formatTime(new Date())
            const nowTimeFormat = new Date(Date.parse(nowTime))
            for (var i = 0; i < res.result.data.length; i++) {
                var beginTime = res.result.data[i].myBeginTime
                var beginTimeFormat = new Date(Date.parse(beginTime.replace(/-/g, "/")))
                if ((res.result.data[i].status == true) && (nowTimeFormat.getTime() > beginTimeFormat.getTime())) {
                    db.collection('myenroll').doc(res.result.data[i]._id).update({
                        data: {
                            status: false
                        }
                    }).then(res => {
                        console.log(res)
                    })
                }
            }
        })
        db.collection('config').get().then(res=>{
            this.setData({
                place: res.data[0].place
            })
        })
        // var samllTime = "2022-03-16 11:00:00";
        // var bigTime = "2022-04-03 16:00:00";
        // var small = new Date(Date.parse(samllTime.replace(/-/g, "/")))
        // console.log(samllTime.replace(/-/g, "/"))
        // console.log("small: " + small)
        // var big = new Date(Date.parse(bigTime.replace(/-/g, "/")))
        // console.log("big" + big)
        // if (small.getTime() > big.getTime()) {
        //     console.log("yes")
        // } else if (small.getTime() < big.getTime()) {
        //     console.log("no")
        // } else {
        //     console.log("wrong")
        // }
        // var now = dates.formatTime(new Date())
        // var nowTime = new Date(Date.parse(now))
        // console.log(nowTime)
        // console.log(now)
        // if (small.getTime() > nowTime.getTime()) {
        //     console.log("yes")
        // } else {
        //     console.log("no")
        // }
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