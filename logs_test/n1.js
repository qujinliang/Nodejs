const io = require('socket.io-client');
var http = require('http');
var url = require('url');
var util = require('util');
var roomid ='DAC35845A907804F9C33DC5901307461';

function sessionid(callback) {
    http.get('http://view.csslcloud.net/api/room/login?roomid='+ roomid + '&userid=99BB96FA148B8FAB&viewername=tester', function (response) {
    var body = [];
    var key = "";
    response.on('data', function (chunk) {
        body.push(chunk);
    });
    response.on('end', function () {
        body = Buffer.concat(body);
        var body_string = body.toString();
        var body_json = JSON.parse(body_string);
        if(!body_json['datas']){
            console.log(body_json);
            sessionid(callback)
        }
        else {
            key = body_json['datas']['viewer'];
            callback && callback(key);
            console.log(key);
            return (key)
        }
    });
});
}
var i = 0;
var conn_count = 0;
var threshold = 5;
function getSessionid(res) {

    var params = {
    sessionid:res['key'],
    platform:1,
    terminal:0
};
    params.secure = true;
    const socket = io('https://io.csslcloud.net/' + roomid, {
        query: params,
        //此处大坑，设置为true才会开启新的连接
        forceNew:true
    });
    // 验证连接成功
    socket.on('connect', function () {
        console.log('connect sucsse'+ " " +  i);
        // setInterval(function emit_message(){
        //     socket.emit("chat_message", "{'msg' : '聊天消息" + "', 'time' : 11:33:33}");
        //     console.log('chat_message');
        //     }, 5000);
    });
    //console.log('start room_user_count');
    socket.on('room_user_count', function (data) {
        try{
            console.log('room user count',data );
        }catch(e){
            console.log(e);
        }
    });
    socket.on('room_teachers', function (data) {
        console.log('room_teachers',data);
    });

    socket.on('chat_message', function (str) {
        console.log('chat_message',str);
    });

    var j = {
        "userId":"",
        "userName":"",
        "publisherId":"",
        "rollcallId":""
    };

    //监听签到
    socket.on('start_rollcall', function (data) {
        //console.log('start_rollcall',data);
        var timeout = Math.round(Math.random()*5000+1000);
        data = JSON.parse(data);
            j.userId = res['id'];
            j.userName = res['name'];
            j.publisherId = data['publisherId'];
            j.rollcallId = data['rollcallId'];
            console.log(j);
            setTimeout(function() {
                //间隔多长时间开始执行,这里是随机1-5秒
                socket.emit('answer_rollcall',JSON.stringify(j));
                socket.emit('answer_rollcall',JSON.stringify(j));
                timeout = Math.round(Math.random()*5000+1000);
                //console.log(timeout)
            },timeout);
    });

    //绑定event
    socket.on('event', function(data){
        console.log('event');
        });

    // 断开的连接
    socket.on('disconnect', function(){
        conn_count--;
        console.log("reconnection : " + params + "  " + i);
    });
    //重连成功
    socket.on('reconnect', function (str) {
        console.log('成功重连');
    });
    //重连次数
    socket.on('reconnecting', function(msg){
        console.log(msg);
        conn_count++;
        console.log("reconnection : " + msg);
    });
    //连接超时
    socket.on('connect_timeout', function(timeout){
        console.log(timeout)
    });

    setTimeout(function () {
        try {
            socket.emit('room_user_count');
        } catch (e) {
        }
        try {
            socket.emit('room_teachers');
        } catch (e) {
        }
    }, 1500);

    //退出直播间
    var timeout2 = Math.round(Math.random()*150000+50000);
    setTimeout(function () {
        try {
            socket.close();
        } catch (e){
        }
        timeout2 = Math.round(Math.random()*150000+50000);
        console.log(timeout2)
    },timeout2);
    i++
}


function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true){
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

//起多个连接
ii = 0;
setInterval(function () {
    ii ++;
    if(ii>1000){
        return;
    }
    else{
        sessionid(getSessionid);
    }
}, 500);







