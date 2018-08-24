export default function (date) {
    function add0(time) {
        var _time = time;
        return _time < 10 ? '0' + _time : _time;
    }

    var dateobj = {},
        _getdate = date ? new Date(date) : new Date(),
        _day = ["日", "一", "二", "三", "四", "五", "六"],
        dateMinute = add0(_getdate.getMinutes()),
        dateSecond = add0(_getdate.getSeconds()),
        _year = _getdate.getFullYear(),
        _month = add0(_getdate.getMonth() + 1),
        _days = add0(_getdate.getDate()),
        _hours = add0(_getdate.getHours()),
        _second = add0(_getdate.getSeconds());

    dateobj.day = "星期" + _day[_getdate.getDay()];
    dateobj.year = _year + "年";
    dateobj.month = _month + "月";
    dateobj.days = _days + "日";
    dateobj.hour = _hours + '时';
    dateobj.minute = dateMinute + '分';
    dateobj.second = dateSecond + '分';
    dateobj.theDate = dateobj.year + dateobj.month + dateobj.days;
    dateobj.allTheDate = dateobj.year + dateobj.month + dateobj.days + ' ' + _hours + ':' + dateMinute;
    dateobj.allTheDate2 = dateobj.year + dateobj.month + dateobj.days + "  " + dateobj.day;
    dateobj.allTheDate3 = dateobj.year + dateobj.month + dateobj.days + ' ' + _hours + ':' + dateMinute + " " + dateobj.day;
    dateobj.allTheDate4 = dateobj.year + dateobj.month + dateobj.days + ' ' + _hours + ':' + dateMinute + ":" + dateSecond + " " + dateobj.day;
    dateobj.defaultFullDate = _year + '-' + _month + '-' + _days + ' ' + _hours + ':' + dateMinute + ':' + _second;
    dateobj.defaultDate = _year + '-' + _month + '-' + _days;
    dateobj.defaultMonth = _year + '-' + _month;
    dateobj.defaultYear = _year ;

    return dateobj;
}