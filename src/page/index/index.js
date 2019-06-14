
var _mm = require('../../util/mm.js');
_mm.request({
    url: 'http://localhost:8080/getOrder',
    method: 'post',
    success : function(msg){
        console.log(msg.orderName);
    },
    error : function (res) {
        console.log(res.orderName);
    }
})