from flask import Flask,request
#from pyngrok import ngrok
import socket
#import paho.mqtt.client as mqtt
import json
'''
ngrok.kill()
http_tunnel = ngrok.connect(5000)
tunnels = ngrok.get_tunnels()
print(tunnels)
'''
sock=socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

app=Flask(__name__)
#client = mqtt.Client()
#client.connect("127.0.0.1",1883,60)

#@app.route('/app298',methods=['POST'])
@app.route('/<path:event>',methods=['POST'])
def app298(event=None):
    request_data = request.get_json()
    #client.publish('app298',json.dumps(request_data))
    sock.sendto(bytes(json.dumps(request_data),'UTF-8'),('127.0.0.1',5010))
    print('Event type: {}'.format(event))
    print('Msg:')
    print(request_data)
    return str(request_data)

@app.route('/test',methods=['get'])
def test():
    return str(json)
    
app.run(host='0.0.0.0',port=5000)