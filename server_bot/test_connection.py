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
    print('Mencoba ulang dengan tlsAllowInvalidCertificates=True (hanya untuk debug)...')
    try:
        client = MongoClient(MONGO_URI, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=10000, tlsAllowInvalidCertificates=True)
        client.admin.command('ping')
        print('MongoDB Cloud connection successful (WARNING: tlsAllowInvalidCertificates=True, jangan gunakan di production!)')
        client.close()
        sys.exit(0)
    except Exception as e2:
        print(f'MongoDB Cloud connection failed (even with tlsAllowInvalidCertificates=True): {e2}')
        sys.exit(1) 