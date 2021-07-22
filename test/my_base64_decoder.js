var buffer = require('buffer').Buffer;

var decode_string = "MzQ2NDIyOzExMWE1OzZiMWNhNTA7MTE4OTY3YTA7MTQ2O0I";
var decode_string2 = "MTM0NjQyMjsxMDk0Njs2YjFjYjAwOzExODk2NjAwOzE1Yjs=";
var decode_string3 = "MTM0NjQyMjsxMTE3YTs2YjFjYTUwOzExODk2N2EwMTQ3O0I=";

function b64_decoder(string){
var base64_decode = buffer(string, 'base64').toString('ascii');
console.log("---------------------");
console.log("Decode by 64bit:  "+base64_decode);

var split_decode = base64_decode.split(';');
var array_decode = [];
split_decode.forEach((e) => {
    array_decode.push(e);
});
try {
    var date = toDate(parseInt(array_decode[0], 16).toString());
    var time = toTime(parseInt(array_decode[1], 16));
    var latitude = ((parseInt(array_decode[2], 16)/1000000)-90).toPrecision(8);
    var longitude = ((parseInt(array_decode[3], 16)/1000000)-90).toPrecision(8);
    var battery = (parseInt(array_decode[4],16)/100).toPrecision(3);
    var msgType = array_decode[5];
    
} catch (error) {
    console.error(error);
    return;
}
console.log("date:             "+date);
console.log("time:             "+time);
console.log("latitude:         "+latitude);
console.log("longitude:        "+longitude);
console.log("battery:          "+battery);
console.log("msgType:          "+msgType);

console.log(array_decode);
}

function toTime(time){
    var second=time%60;
    var minute=((time-second)/60)%60;
    var hour=((time-minute*60-second)/3600);
    if(second<10)second="0"+second;
    if(minute<10)minute="0"+minute;
    if(hour<10)hour="0"+hour;
    return hour+":"+minute+":"+second;
}

function toDate(date){
    var year=date.substring(0,4);
    var month=date.substring(4,6);
    var day=date.substring(6,8);
    return year+"-"+month+"-"+day;
}
b64_decoder(decode_string)
b64_decoder(decode_string2);
b64_decoder(decode_string3);