
var hoGan = require('hogan');

var conf = {
    serverHost: ''
}

var _mm = {
    /*格式为key-value模式*/
    request : function (param) {
        var _this = this; //必须这样写
        //jquery中ajax请求，需要传入对象进去
        $.ajax({
            /*请求类型*/
            type        : param.method || 'get',
            /*请求的地址*/
            url         :  param.url || '',
            /*请求的数据类型*/
            dataType    : param.type || 'json',
            /*请求的数据*/
            data        : param.data || '',
            /*请求成功时候，回调的函数。请求成功，但是请求数据不一定成功*/
            success     : function (res) {
                //请求成功
                if(0 === res.status){
                    /*这行代码写的很有艺术,大师写的代码*/
                    typeof param.success === 'function' && param.success(res);

                    /*/!*我等渣渣写的代码*!/
                    if(typeof  param.success === 'function'){
                        param.success(res.data,res.msg);
                    }
*/
                }
                // 没有登录状态，需要强制登录
                else if(10 === res.status){
                    _this.doLogin();
                    //this.doLogin
                }
                // 请求数据错误
                else if(1 === res.status){
                    /*这行代码写的很有艺术*/
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            //请求错误，回调函数
            error       : function (err) {
                console.log(err)
                /*这行代码写的很有艺术*/
                typeof param.error === 'function' && param.error(err.msg);
            }

        });
    },
    //获取服务器地址
    getServerUrl        : function (path) {
        return conf.serverHost + path;
    },
    //获取url参数
    getUrlParam         : function (name) {
       var reg     = new RegExp('(^|$)'+name+'=([^&]*)(&|$)');
       var result  = window.location.search.substr(1).match(reg);
       return result ? decodeURIComponent(result[2]) : null;
    },
    /*将数据动态的绑定到html里面*/
    renderHtml          : function (htmlTemplate,data) {
            var template = hogan.compile(htmlTemplate);
            var result = template.render(data);
            return result;
    },
    successTips         : function (msg) {
        alert(msg || '操作成功!');
    },
    errorTips           : function (msg) {
        alert(msg || '哪里不对了~');
    },
    validate            : function (value,type) {
        var value = $.trim(value);
        //非空验证
        if("require" === type){
            return !!value;
        }

        //手机号验证
        if("phone" === type){
            return /^1\d{10}$/.test(value);
        }
        if("email" === type){
            return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
        }
    },
    doLogin              : function () {
        /*登录成功后，重定向到上一个页面，防止每次都跳到主页*/
        window.location.href = './user-login.html?redirect='+encodeURIComponent(window.location.href);

    },
    goHome               : function () {
        window.location.href = './index.html'
    }

};

/*导出模块*/
module.exports=_mm;