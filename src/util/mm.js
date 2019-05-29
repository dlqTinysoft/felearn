var _mm = {
    request : function (param) {
        var _this = this; //必须这样写
        //jquery中ajax请求，需要传入对象进去
        $.ajax({
            type        : param.method || 'get',
            url         :  param.url || '',
            dataType    : param.type || 'json',
            data        : param.data || '',
            success     : function (res) {
                //请求成功
                if(0 === res.status){
                    typeof param.success === 'function' && param.success(res.data,res.msg);

                }
                // 没有登录状态，需要强制登录
                else if(10 === res.status){
                    _this.doLogin();
                    //this.doLogin
                }
                // 请求数据错误
                else if(1 === res.status){
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            //请求数据错误
            error       : function (err) {
                typeof param.error === 'function' && param.error(res.msg);
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
    renderHtml          : function (htmlTemplate,data) {

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
        window.location.href = './user-login.html?redirect='+encodeURIComponent(window.location.href);

    },
    goHome                : function () {
        window.location.href = './index.html'
    }

};

module.exports=_mm;