import fetch from '../server/node_modules/node-fetch';

let a = ['22.273161,114.191919','22.274483,114.195465','22.324917,114.215248',
'22.328341,114.191986','22.336586,114.130546','22.346457,114.124070',
'22.381631,114.214226','22.430289,114.252303','22.389370,113.980248',
'22.399151,113.977986','22.429402,114.033365','22.436956,114.043096',
'22.483473,114.146010','22.492680,114.123316'];

let b = ['大坑','大坑大坑徑25號','九龍灣牛頭角道77號',
'太子道東','荔枝角','葵涌貨櫃碼頭路','廣源邨2座廣榕樓小瀝源小瀝源路68號',
'帝琴灣','屯門','新墟','大棠大樹下東路','元朗','粉嶺和家樓路','上水'];

async function gpsTest(){
    for (let i = 0; i < a.length; i++) {
        let res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${a[i].split(',')[0]}&lon=${a[i].split(',')[1]}&format=json&zoom=16`)
        let data = await res.json();
        console.log(`${i+1}: ${b[i]} ${a[i]}`);
        console.log(data.address.county || data.address.city_district);
    }
}
gpsTest();