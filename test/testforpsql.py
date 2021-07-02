import json
import psycopg2
from flask import Flask,request


conn = psycopg2.connect(database='handbrakedata', user='icewingsyo', password='abc2534yhj16', host='localhost', port='5432')

req = request.get('http://www.nhl.com/stats/rest/skaters?isAggregate=false&reportType=basic&isGame=false&reportName=skatersummary&sort=[{%22property%22:%22playerName%22,%22direction%22:%22ASC%22},{%22property%22:%22goals%22,%22direction%22:%22DESC%22},{%22property%22:%22assists%22,%22direction%22:%22DESC%22}]&cayenneExp=gameTypeId=2%20and%20seasonId%3E=20172018%20and%20seasonId%3C=20172018') 
data = req.json()['data']

cur = conn.cursor()

field = ['seasonId',
    'playerName',
    'playerFirstName',
    'playerLastName',
    'playerId',
    'playerHeight',
    'playerPositionCode',
    'playerShootsCatches',
    'playerBirthCity',
    'playerBirthCountry',
    'playerBirthStateProvince',
    'playerBirthDate',
    'playerDraftYear',
    'playerDraftRoundNo',
    'playerDraftOverallPickNo'
]