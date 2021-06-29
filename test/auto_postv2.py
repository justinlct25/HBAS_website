import requests
import time

endpoint='http://localhost:5000/app298?event=up'
#endpoint='https://c6f89013baec.ngrok.io/app298?event=up'
interval=2

join={"applicationID":"298","applicationName":"VTC_HandBrakeAlertSystem_2021",
      "deviceName":"ramp_meter_000","devEUI":"RzrIaAAqADc=","devAddr":"Ac4oSg==",
      "rxInfo":[{"gatewayID":"rB8J//4ATng=","time":None,"timeSinceGPSEpoch":None,
                 "rssi":-64,"loRaSNR":12.3,"channel":6,"rfChain":1,"board":0,"antenna":0,
                 "location":{"latitude":0,"longitude":0,"altitude":0,"source":"UNKNOWN","accuracy":0},
                 "fineTimestampType":"NONE","context":"CO1dpA==","uplinkID":"PEpY6ueqSUeFee2UH5aYTg==",
                 "crcStatus":"CRC_OK"}],"txInfo":{"frequency":923400000,"modulation":"LORA",
                "loRaModulationInfo":{"bandwidth":125,"spreadingFactor":10,"codeRate":"4/5",
                                      "polarizationInversion":False}},"dr":2,"tags":{}}

up={"applicationID":"298","applicationName":"VTC_HandBrakeAlertSystem_2021",
    "deviceName":"ramp_meter_000",
    "devEUI":"RzrIaAAqADc=",
    "rxInfo":[{"gatewayID":"rB8J//4ATng=","time":None,
               "timeSinceGPSEpoch":None,"rssi":-63,"loRaSNR":8.5,"channel":5,
               "rfChain":1,"board":0,"antenna":0,
               "location":{"latitude":0,"longitude":0,"altitude":0,"source":"UNKNOWN","accuracy":0},
               "fineTimestampType":"NONE","context":"7giTDA==","uplinkID":"buVmAweHTd+kmGh6xeM+GA==",
               "crcStatus":"CRC_OK"}],
    "txInfo":{"frequency":923200000,"modulation":"LORA",
              "loRaModulationInfo":{"bandwidth":125,"spreadingFactor":10,"codeRate":"4/5",
                                    "polarizationInversion":False}},
    "adr":True,"dr":2,"fCnt":83,"fPort":8,
    "data":"MTsyZTtjMDszNjdiMjsxMTZkYTE7MDsxYTsw",
    "objectJSON":"{\"date\":\"2020-06-03\",\"time\":\"05:19:53\",\"latitude\":22.123456,\"longitude\":\"114.12346\",\"battery\":\"1.95\"}",
    "tags":{},"confirmedUplink":False,"devAddr":"ACXnlQ=="
}

msg_queue=[join,up,up,up]
i=1
while True:
    for msg in msg_queue:
        request=requests.post(url=endpoint,json=msg)
        print('{} msg sent'.format(i))
        i=i+1
        time.sleep(interval)



