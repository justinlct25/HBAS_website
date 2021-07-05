// test for react frontend

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



// test for python json post in main.ts

app.use((req, res, next) => {
    if(JSON.stringify(req.query).match('up')){ console.log('correct')}
    const applicationID = req.query;
    const bb = JSON.stringify(applicationID);
    const cc = bb.replace(/\'/gi,`"`);
    const dd = cc.replace(/None/gi, `null`);
    const ee = dd.replace(/False/gi, `false`);
    const ff = ee.replace(/True/gi, `true`);
    // const gg = JSON.parse(ff);
    logger.info(ff.match('up'));
    logger.info(ff);
    // console.log(JSON.parse(JSON.stringify(applicationID)));
    //console.log(bb);
    // const texta = [{"applicationID": "298", "applicationName": "VTC_HandBrakeAlertSystem_2021", "deviceName": "ramp_meter_000", "devEUI": "RzrIaAAqADc=", "devAddr": "Ac4oSg==", "rxInfo": [{"gatewayID": "rB8J//4ATng=", "time": null, "timeSinceGPSEpoch": null, "rssi": -64, "loRaSNR": 12.3, "channel": 6, "rfChain": 1, "board": 0, "antenna": 0, "location": {"latitude": 0, "longitude": 0, "altitude": 0, "source": "UNKNOWN", "accuracy": 0}, "fineTimestampType": "NONE", "context": "CO1dpA==", "uplinkID": "PEpY6ueqSUeFee2UH5aYTg==", "crcStatus": "CRC_OK"}], "txInfo": {"frequency": 923400000, "modulation": "LORA", "loRaModulationInfo": {"bandwidth": 125, "spreadingFactor": 10, "codeRate": "4/5", "polarizationInversion": false}}, "dr": 2, "tags": {}}, {"applicationID": "298", "applicationName": "VTC_HandBrakeAlertSystem_2021", "deviceName": "ramp_meter_000", "devEUI": "RzrIaAAqADc=", "rxInfo": [{"gatewayID": "rB8J//4ATng=", "time": null, "timeSinceGPSEpoch": null, "rssi": -63, "loRaSNR": 8.5, "channel": 5, "rfChain": 1, "board": 0, "antenna": 0, "location": {"latitude": 0, "longitude": 0, "altitude": 0, "source": "UNKNOWN", "accuracy": 0}, "fineTimestampType": "NONE", "context": 
    // "7giTDA==", "uplinkID": "buVmAweHTd kmGh6xeM GA==", "crcStatus": "CRC_OK"}], "txInfo": {"frequency": 923200000, "modulation": "LORA", "loRaModulationInfo": {"bandwidth": 125, "spreadingFactor": 10, "codeRate": "4/5", "polarizationInversion": false}}, "adr": true, "dr": 2, "fCnt": 83, "fPort": 8, "data": "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw", "objectJSON": [{"date": "2020-06-03", "time": "05:19:53", "latitude": "22.123456", "longitude": "114.12346", "battery": "1.95"}], "tags": {}, "confirmedUplink": false, "devAddr": "ACXnlQ=="}, {"applicationID": "298", "applicationName": "VTC_HandBrakeAlertSystem_2021", "deviceName": "ramp_meter_000", "devEUI": "RzrIaAAqADc=", "rxInfo": [{"gatewayID": "rB8J//4ATng=", "time": null, "timeSinceGPSEpoch": null, "rssi": -63, "loRaSNR": 8.5, "channel": 5, "rfChain": 1, "board": 0, "antenna": 0, "location": {"latitude": 0, "longitude": 0, "altitude": 0, "source": "UNKNOWN", "accuracy": 0}, "fineTimestampType": "NONE", "context": "7giTDA==", "uplinkID": "buVmAweHTd kmGh6xeM GA==", "crcStatus": "CRC_OK"}], "txInfo": {"frequency": 923200000, "modulation": "LORA", "loRaModulationInfo": {"bandwidth": 125, "spreadingFactor": 10, "codeRate": "4/5", "polarizationInversion": false}}, "adr": true, "dr": 2, "fCnt": 83, "fPort": 8, "data": "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw", "objectJSON": [{"date": "2020-06-03", "time": "05:19:53", "latitude": "22.123456", "longitude": "114.12346", "battery": "1.95"}], "tags": {}, "confirmedUplink": false, "devAddr": "ACXnlQ=="}, {"applicationID": "298", "applicationName": "VTC_HandBrakeAlertSystem_2021", "deviceName": "ramp_meter_000", "devEUI": "RzrIaAAqADc=", "rxInfo": [{"gatewayID": "rB8J//4ATng=", "time": null, "timeSinceGPSEpoch": null, "rssi": -63, "loRaSNR": 8.5, "channel": 5, "rfChain": 1, "board": 0, "antenna": 0, "location": {"latitude": 0, "longitude": 0, "altitude": 0, "source": "UNKNOWN", "accuracy": 0}, "fineTimestampType": "NONE", "context": "7giTDA==", "uplinkID": "buVmAweHTd kmGh6xeM GA==", "crcStatus": "CRC_OK"}], "txInfo": {"frequency": 923200000, "modulation": "LORA", "loRaModulationInfo": {"bandwidth": 125, "spreadingFactor": 10, "codeRate": "4/5", "polarizationInversion": false}}, "adr": true, "dr": 2, "fCnt": 83, "fPort": 8, "data": "MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw", "objectJSON": [{"date": "2020-06-03", "time": "05:19:53", "latitude": "22.123456", "longitude": "114.12346", "battery": "1.95"}], "tags": {}, "confirmedUplink": false, "devAddr": "ACXnlQ=="}];
    //     console.log(texta[0].objectJSON);
    //     console.log(texta[1].objectJSON);
    //     console.log(texta[2].objectJSON);
    //     console.log(texta[3].objectJSON);
        //const query = url.parse(req.url).query;
        ////logger.info(query);
        console.log('-----');
        //const obj = (decodeURIComponent(query));
        // const testa = JSON.parse(JSON.stringify(obj));
        // logger.info(testa.event[0]);
        //res.send(obj);
        
    
    next();
});
// app.post('/app298', (req, res)=>{
//     try {
//         const queryA = url.parse(req.url).query;
    
//         if(queryA){
//             const obj = JSON.parse(decodeURIComponent(queryA))
//             logger.info(obj);
//         }
//         //const jsona = req.query.event;
//         //logger.info(jsona);
//         res.json({ message:'hi'});
//     } catch (err) {
//         logger.error(err);
//         res.status(500).json({message:'hi'});
//     }
    
// })