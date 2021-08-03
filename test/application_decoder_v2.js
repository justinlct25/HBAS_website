function hex_to_ascii(str1) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

function toHexString(bytes) {
  return bytes
    .map(function (byte) {
      return ("00" + (byte & 0xff).toString(16)).slice(-2);
    })
    .join("");
}

function totime(time) {
  var second = time % 60;
  var minute = ((time - second) / 60) % 60;
  var hour = (time - minute * 60 - second) / 3600;
  if (second < 10) second = "0" + second;
  if (minute < 10) minute = "0" + minute;
  if (hour < 10) hour = "0" + hour;
  return hour + ":" + minute + ":" + second;
}
// 23:59:59 = 23*60^2+59*60+59 = 86399
//var time=86399;

function todate(date) {
  var year = date.substring(0, 4);
  var month = date.substring(5, 6);
  var day = date.substring(7, 8);
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;
  return year + "-" + month + "-" + day;
}
// YYYYMMDD ==> YYYY-MM-DD
//var date=20210623;

var date = 20200623;
var time = 5 * 3600 + 19 * 60 + 53;
var latitude = (22.123456 + 90) * 1e6;
var longitude = (114.123456 + 180) * 1e6;
var battery = 1.95 * 100;
var original_msg = "20200623;19193;112123456;294123456;195";

var hex_date = date.toString(16);
var hex_time = time.toString(16);
var hex_latitude = latitude.toString(16);
var hex_longitude = longitude.toString(16);
var hex_battery = battery.toString(16);
var hex_data =
  hex_date +
  ";" +
  hex_time +
  ";" +
  hex_latitude +
  ";" +
  hex_longitude +
  ";" +
  hex_battery;

var bytes = [];
for (i = 0; i < hex_data.length; i++) {
  bytes[i] = hex_data.substring(i).charCodeAt(0);
}

var tohex = toHexString(bytes);

var toascii = hex_to_ascii(tohex);

var subject = toascii.split(";");

var js = {
  date: todate(parseInt(subject[0], 16).toString()),
  time: totime(parseInt(subject[1], 16)),
  latitude: (parseInt(subject[2], 16) / 1000000 - 90).toPrecision(8),
  longitude: (parseInt(subject[3], 16) / 1000000 - 180).toPrecision(8),
  battery: parseInt(subject[4], 16) / 100,
};
