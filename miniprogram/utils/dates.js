function getDateByAdd(days){
    let dateList = this.getDates(days);
    const date = new Date()
    const hours = []
    const minutes = ['00', '30']
    var todayMinutes = parseInt(date.getMinutes());
    var todayhour = (todayMinutes >= 30 ? (date.getHours() + 1) : date.getHours());//当前时
    var newtodayMinutes = todayMinutes < 30 ? '30' : '00';//当前分
    for (let i = 1; i <= 23; i++) {
      hours.push(i)
    }
    // var selected = dateList[0].year + "-" + dateList[0].newdates + "\t" + ((todayhour >= 10) ? todayhour : ("0" + todayhour)) + ":" + newtodayMinutes;
    var selected = dateList[days-1].year + "-" + dateList[days-1].newdates;
    return selected;
}


const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  
  //判断两个时间比较大小
  function compareDate(d1, d2) {
    return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
  }
  
  //当前时间获取
  function getCurrentToday(){
    const date = new Date()
    var year = date.getFullYear();
    var mouths = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
    var hours = date.getHours();
    var Minutes = date.getMinutes();//当前分
    var currentdate = year + "-" + mouths + "-" + day + "\t" + hours + ":" + Minutes;
    return currentdate
  }
  
  /**
   * 传入时间后几天
   * param：传入时间：dates:"2018-04-02",later:往后多少天
   */
  function dateLater(dates, later) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    dateObj.dates = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "月" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "日";
    dateObj.newdates = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.year = date.getFullYear();
    dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.week = show_day[day];
    return dateObj;
  }

//获取d当前时间多少天后的日期和对应星期
function getDates(days,todate=getCurrentMonthFirst()) {//todate默认参数是当前日期，可以传入对应时间
    var dateArry = [];
    for (var i = 0; i < days; i++) {
      var dateObj = dateLater(todate, i);
      dateArry.push(dateObj)
    }
    return dateArry;
  }


//获取当前时间
function getCurrentMonthFirst() {
    var date = new Date();
    var todate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth()+1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    return todate;
  }
  
  module.exports = {
    formatTime: formatTime,
    compareDate: compareDate,
    getCurrentToday: getCurrentToday,
    dateLater: dateLater,
    getDates: getDates,
    getDateByAdd: getDateByAdd,
    getCurrentMonthFirst: getCurrentMonthFirst
  }