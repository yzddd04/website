#!/usr/bin/env python3
import sys
from pymongo import MongoClient
import certifi

MONGO_URI = 'mongodb+srv://ahmadyazidarifuddin04:Qwerty12345.@server.hvqf3sk.mongodb.net/?retryWrites=true&w=majority&appName=server'

try:
    client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000)
    client.admin.command('ping')
    print('MongoDB Cloud connection successful')
    client.close()
    sys.exit(0)
except Exception as e:
    print(f'MongoDB Cloud connection failed: {e}')
    sys.exit(1) 