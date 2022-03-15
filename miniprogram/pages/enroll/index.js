// pages/enroll/index.js
import Toast from '@vant/weapp/toast/toast';
var dates = require('../../utils/dates')
const db = wx.cloud.database()
const _ = db.command
var times = require('../../utils/times')
var plugin = requirePlugin("myPlugin")
// import Toast from 'path/to/@vant/weapp/dist/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        envId: '',
        openid: '',
        date: '',
        show: false,
        name: '',
        age:'',
        phone: '',
        job: '',
        //性别单选框
        radio: '1',
        /////日历插件参数
        startTime: '08:00',
        endTime: '18:00',
        unit: 30, //时间显示间隔
        reserveUnit: 60, //预约时间长度
        activedConst: 101, //选中的时间段
        disabledConst: 102, //不可选时间段状态码
        unreserveTime: [], //不可选时间
        beginTp: '',
        endTp: '',
        ////
        unableTime: [], //不可预约的时间
        startTimeCommit: '', //最终预约的时间
        endTimeCommit: '', //最终预约时间
        number: '', //某时间段可预约人数


    },
    //选择日期
    onDisplay() {
        this.setData({
            show: true
        });
    },
    onClose() {
        this.setData({
            show: false
        });
    },
    formatDate(date) {
        date = new Date(date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(event) {
        this.setData({
            show: false,
            date: this.formatDate(event.detail),
        });
    },
    onChangeRadio(event) {
        this.setData({
            radio: event.detail,
        });
    },
    onChangeName(e) {
        // console.log(e)
        // event.detail 为当前输入的值
        console.log(e.detail);
        this.setData({
            name: e.detail
        })
        // console.log(this.name)
    },
    onChangeAge(e){
        console.log(e.detail)
        this.setData({
            age:e.detail
        })
    },
    onChangePhone(e) {

        // event.detail 为当前输入的值
        console.log(e.detail);
        this.setData({
            phone: e.detail
        })
        // console.log(this.name)
    },
    onChangeJob(e) {
        // event.detail 为当前输入的值
        console.log(e.detail);
        this.setData({
            job: e.detail
        })
        // console.log(this.name)
    },


    onSelectTime(e) {
        const {
            startTimeText,
            endTimeText
        } = e.detail;


        var endtimeSplit = (endTimeText.split(" "))[1];
        var starttimeSplit = (startTimeText.split(" "))[1];
        var dater = (startTimeText.split(" "))[0];

        const timeArea = dater + " " + starttimeSplit + " -- " + endtimeSplit;
        console.log("分割后的时间区间末: " + endtimeSplit)
        this.setData({
            startTimeCommit: startTimeText,
            endTimeCommit: endTimeText,
            timeArea,
        })
    },

    onCommit: function (e) {
        if (this.data.startTimeCommit != "" && this.data.phone != '' && this.data.name != '' && this.data.job != '') {

            if (this.data.openid == '') {
                wx.cloud.callFunction({
                    name: 'open',
                    success: (res) => {
                        var usid = res.result.openid
                        console.log(usid)
                        this.setData({
                            openid: res.result.openid,
                        })
                        console.log("在commit处设置openid: is " + this.data.openid)
                    }
                })
            }
            //TODO:
            //在此处判断改该时间段是否插入过
            db.collection('enrolltime').where({
                enrollBegin: this.data.startTimeCommit,
                enrollEnd: this.data.endTimeCommit
            }).get(
                // {success: res=>{console.log(res)} }
            ).then(res => {
                console.log(res)
                if (res.data.length == 0) {
                    db.collection('enrolltime').add({
                        data: {
                            // openid: this.data.openid,
                            enrollBegin: this.data.startTimeCommit,
                            enrollEnd: this.data.endTimeCommit,
                            number: this.data.number,
                            enable: true
                        },
                        // success: function (res) {
                        //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                        //     // console.log("插入后data.openid"+openid)
                        //     console.log(res)
                        // }
                    }).then(res => {
                        console.log(res)
                        console.log("插入后data.openid" + this.data.openid)
                        db.collection('myenroll').add({
                            data: {
                                openid: this.data.openid,
                                time: this.data.startTimeCommit,
                                phone: this.data.phone,
                                status: true,
                                job: this.data.job
                            },
                        }).then(res => {
                            console.log(res)
                            console.log("插入myenroll")
                        })
                    })
                } else if (res.data.length != 0) {
                    if (res.data[0].enable) {
                        if (res.data[0].number - 1 > 0) {
                            db.collection('enrolltime').doc(res.data[0]._id).update({
                                data: {
                                    number: res.data[0].number - 1,
                                },
                                // success:function(res){
                                //     console.log(number)
                                // }
                            }).then(res => {
                                console.log("更新成功,时间段还可预约 ")
                            })
                        } else {
                            db.collection('enrolltime').doc(res.data[0]._id).update({
                                data: {
                                    number: res.data[0].number - 1,
                                    enable: false
                                }
                            }).then(res => {
                                console.log("更新成功,时间段已约满")
                            })
                        }

                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '时间段已预约完',
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                }
            })

            // db.collection('myenroll').add({
            //     data:{
            //         openid:this.data.openid,
            //         time:this.data.startTimeCommit,
            //         phone:this.data.phone,
            //         status:true,
            //         job:this.data.job
            //     },
            //     success: function (res) {
            //         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            //         // console.log("插入后data.openid"+openid)
            //         console.log(res)

            //     }

            // })
            // console.log("插入后data.openid"+this.data.openid)
        } else {
            wx.showModal({
                title: '提示',
                content: '请补全报名信息!',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // {
        //     var tag = "2022.2.28 17:02:13"
        //     var a = tag.split(" ");
        //     console.log(a)
        //     console.log(a[1])
        // }
        var temp =[]
        wx.cloud.callFunction({
            name: 'open',
            success: (res) => {
                var usid = res.result.openid
                console.log(usid)
                this.setData({
                    openid: res.result.openid,
                })
                console.log("openid: is " + this.data.openid)
            }

        })
        db.collection('enrolltime').where({
            enable:false
        }).get().then(res=>{
            for (var i=0;i<res.data.length;i++){
               this.data.unableTime.push({
                    startTime: res.data[i].enrollBegin,
                    endTime:  res.data[i].enrollEnd,
                    status: 102
                })
            }
        })
        console.log("unable")
        console.log(this.data.unableTime)
        // wx.cloud.callFunction({
        //     name:"getUnableTime",
        //     complete: res=>{
        //         console.log(res.result.data)
        //         this.setData({
        //             unableTime:res.result.data
        //         })
        //     }

        // })



        // 动态设置非服务事件
        // setTimeout(() => {
        db.collection("config").get({
            success: res => {
                var beginTimeTp = []
                var endTimeTp = []
                var num = 2
                var gap = 30
                // console.log(res.data.length)
                for (var i = 0; i < res.data.length; i++) {
                    console.log(res)
                    res.data[i]["restBegin"] = times.toDate(res.data[i]["restBegin"])
                    res.data[i]["restEnd"] = times.toDate(res.data[i]["restEnd"])
                    beginTimeTp = res.data[i]["restBegin"].split(" ");
                    endTimeTp = res.data[i]["restEnd"].split(" ");
                    num = res.data[i].number;
                    gap = res.data[i].divide;
                    console.log("fjoasidjfoihaoifhoisdhgoihasodvnknvkjdihvfoiwnhdg")
                    console.log(beginTimeTp[1])
                    console.log(beginTimeTp)
                    // beginTp=beginTimeTp[1]
                    console.log(res.data[i]["divide"])
                    console.log("number:" + num)
                }

                console.log("这是第一次给beginTIme赋值" + beginTimeTp[1])
                this.setData({
                    beginTp: beginTimeTp[1],
                    endTp: endTimeTp[1],
                    unit: gap,
                    number: num
                })

                // var start=dates.getDateByAdd(1)+" "+beginTimeTp[1]+":00"
                // console.log(beginTimeTp[1])
                // console.log("start:"+start)
            }
        })
        // .then(res=>{
        //     console.log("ceshi")
        // })
        // var now = new Date();
        // var exitTime = now.getTime() + 10000;
        // while (true) {
        //   now = new Date();
        //   if (now.getTime() > exitTime)
        //     break;
        // }

        // var start=dates.getDateByAdd(1)+" "+beginTp+":00"
        // console.log(beginTp)
        // console.log("start:"+start)
        // for (var i=1;i<4;i++){
        //     console.log(i)

        //     temp.push({
        //         // startTime: dates.getDateByAdd(i)+" "+beginTp+":00",
        //         startTime: start,
        //         endTime: dates.getDateByAdd(i)+" "+"13:00"+":00",
        //         status: 102, // 不能选中
        //     },)

        // }
        // console.log(temp)
        // this.setData({
        //     //     unreserveTime: [{
        //     //         startTime: '2022-03-18 14:00:00',
        //     //         endTime: '2022-03-18 15:00:00',
        //     //         status: 102, // 不能选中
        //     //     },
        //     //     {
        //     //         startTime: '2022-03-19 14:00:00',
        //     //         endTime: '2022-03-19 15:00:00',
        //     //         status: 102, // 不能选中
        //     //     },
        //     // ],
        //     unreserveTime: temp
        // });
        // }, 2000)
        this.setData({
            envId: options.envId
        });
        // var dateList= dates.getDateByAdd(1)
        console.log("this is data today ")
        // console.log(dates.getCurrentMonthFirst())
        console.log("this is data add ")
        // console.log(dateList)
        //   console.log(envid+"这是envid")
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var temp = []
        var start = dates.getDateByAdd(1) + " " + this.data.beginTp + ":00"
        var end = dates.getDateByAdd(1) + " " + this.data.endTp + ":00"
        console.log(this.data.beginTp)
        console.log("start:" + start)
        console.log("end:" + end)

        for (var i = 1; i < 10; i++) {
            // console.log(i)
            temp.push({
                // startTime: dates.getDateByAdd(i)+" "+beginTp+":00",
                startTime: dates.getDateByAdd(i) + " " + this.data.beginTp + ":00",
                endTime: dates.getDateByAdd(i) + " " + this.data.endTp + ":00",
                status: 102, // 不能选中
            }, )
            // this.setData({
            //     unreserveTime:unreserveTime.push(temp)
            // })
        }
        temp.push({
            startTime: dates.getDateByAdd(10)+ " "+ "00:00:00",
            endTime: dates.getDateByAdd(58)+ " "+ "23:00:00",
            status:102
        })
        console.log(temp)
        this.setData({

            unreserveTime: temp
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



})