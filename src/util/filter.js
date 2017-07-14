import Vue from 'Vue'

var hospitalFilter = {};

hospitalFilter.install = function(Vue) {
    Vue.filter('formDate', function(val, fmt) {
        var value = new Date(Number(val));
        var o = {
            "M+": value.getMonth() + 1, // 月份
            "d+": value.getDate(), // 日
            "h+": value.getHours(), // 小时
            "m+": value.getMinutes(), // 分
            "s+": value.getSeconds(), // 秒
            "q+": Math.floor((value.getMonth() + 3) / 3), // 季度
            "S": value.getMilliseconds()
                // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    })

    Vue.filter('formDateHasNull', function(val, fmt) {
        if(!val) return '';
        var value = new Date(Number(val));
        var o = {
            "M+": value.getMonth() + 1, // 月份
            "d+": value.getDate(), // 日
            "h+": value.getHours(), // 小时
            "m+": value.getMinutes(), // 分
            "s+": value.getSeconds(), // 秒
            "q+": Math.floor((value.getMonth() + 3) / 3), // 季度
            "S": value.getMilliseconds()
                // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    })

    Vue.filter('formDateToWeek',function(val){
        var value = new Date(Number(val));
        var arr = ['日','一','二·','三','四','五','六'];
        return '星期'+arr[value.getDay()];
    })

}
export default hospitalFilter
