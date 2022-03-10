// pages/enroll/index.js
import Toast from '@vant/weapp/toast/toast';
var plugin = requirePlugin("myPlugin")
// import Toast from 'path/to/@vant/weapp/dist/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        envId: '',
        date: '',
        show: false,
        name: '',
        phone:'',
        job:'',

        /////日历插件参数
        startTime: '08:00',
        endTime: '18:00',
        unit: 30,      //时间显示间隔
        reserveUnit: 30,   //预约时间长度
        activedConst: 101,   //选中的时间段
        disabledConst: 102,  //不可选时间段状态码
        unreserveTime: [],   //不可选时间

////
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

    onChangeName(e) {
        // console.log(e)
        // event.detail 为当前输入的值
        console.log(e.detail);
       this.setData({
           name:e.detail
       })
        console.log(this.name)
    },
    onChangePhone(e) {
        
        // event.detail 为当前输入的值
        console.log(e.detail);
       this.setData({
           phone:e.detail
       })
        console.log(this.name)
    },
    onChangeJob(e) {
        // event.detail 为当前输入的值
        console.log(e.detail);
       this.setData({
           job:e.detail
       })
        console.log(this.name)
    },


    onSelectTime(e) {
        const {
            startTimeText,
            endTimeText
        } = e.detail;
        this.setData({
            startTimeText,
            endTimeText,
        })
    },

    // onCommit: function(e){
    //     this.setData{
            
    //     }
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 动态设置非服务事件
        setTimeout(() => {
            this.setData({
                unreserveTime: [{
                    startTime: '2022-03-18 14:00:00',
                    endTime: '2022-03-18 15:00:00',
                    status: 102, // 不能选中
                },
                {
                    startTime: '2022-03-19 14:00:00',
                    endTime: '2022-03-19 15:00:00',
                    status: 102, // 不能选中
                },
            ]
            });
        }, 2000)
        this.setData({
            envId: options.envId
          });
        //   console.log(envid+"这是envid")
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

    },



    










});