import json
import requests
import time


#endpoint='https://c6f89013baec.ngrok.io/app298?event=up'
interval=2

join={"applicationID":"298","applicationName":"VTC_HandBrakeAlertSystem_2021",
      "deviceName":"ramp_meter_000","devEUI":"RzrIaAAqADc=","devAddr":"Ac4oSg==",
      "rxInfo":[{"gatewayID":"rB8J//4ATng=","time":"null","timeSinceGPSEpoch":"null",
                 "rssi":-64,"loRaSNR":12.3,"channel":6,"rfChain":1,"board":0,"antenna":0,
                 "location":{"latitude":0,"longitude":0,"altitude":0,"source":"UNKNOWN","accuracy":0},
                 "fineTimestampType":"NONE","context":"CO1dpA==","uplinkID":"PEpY6ueqSUeFee2UH5aYTg==",
                 "crcStatus":"CRC_OK"}],"txInfo":{"frequency":923400000,"modulation":"LORA",
                "loRaModulationInfo":{"bandwidth":125,"spreadingFactor":10,"codeRate":"4/5",
                                      "polarizationInversion":"false"}},"dr":2,"tags":{}}

up={"applicationID":"298","applicationName":"VTC_HandBrakeAlertSystem_2021",
    "deviceName":"ramp_meter_000",
    "devEUI":"RzrIaAAqADc=",
    "rxInfo":[{"gatewayID":"rB8J//4ATng=","time":"null",
               "timeSinceGPSEpoch":"null","rssi":-63,"loRaSNR":8.5,"channel":5,
               "rfChain":1,"board":0,"antenna":0,
               "location":{"latitude":0,"longitude":0,"altitude":0,"source":"UNKNOWN","accuracy":0},
               "fineTimestampType":"NONE","context":"7giTDA==","uplinkID":"buVmAweHTd+kmGh6xeM+GA==",
               "crcStatus":"CRC_OK"}],
    "txInfo":{"frequency":923200000,"modulation":"LORA",
              "loRaModulationInfo":{"bandwidth":125,"spreadingFactor":10,"codeRate":"4/5",
                                    "polarizationInversion":"false"}},
    "adr":"true","dr":2,"fCnt":83,"fPort":8,
    "data":"MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw",
    "objectJSON":[{"date":"2020-06-03","time":"05:19:53","latitude":"22.123456","longitude":"114.12346","battery":"1.95"}],
    "tags":{},"confirmedUplink":"false","devAddr":"ACXnlQ=="
}
newHeaders = {'Content-type': 'application/json', 'Accept': 'text/plain'}
msg_queue=[join,up,up,up]
endpoint='http://localhost:8080/alertData'
i=0
while True:
    for msg in msg_queue:
        response=requests.post(url=endpoint,json=msg,headers=newHeaders)
        print(response.status_code)
        i=i+1
        print('{} msg sent'.format(i))
        print(json.dumps(msg))
        time.sleep(interval)