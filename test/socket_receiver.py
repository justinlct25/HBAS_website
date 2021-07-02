import socket
import json
# import psycopg2
# import requests

host='127.0.0.1'
port=5010
buffer_size=60000

#conn = psycopg2.connect(database='handbrakedata', user='icewingsyo', password='abc2534yhj16', host='localhost', port='5432')
#req = requests.get('')
sock=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)

sock.bind((host,port))
print('sock bind now')
i=1
while True:
    data,addr=sock.recvfrom(buffer_size)
    print('{} msg recevied:'.format(i))
    i=i+1
    tojson=json.loads(data.decode("UTF-8"))
    print(tojson)