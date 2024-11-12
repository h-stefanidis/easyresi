# General configuration (development, production)

import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('COS60011_SECRET_KEY') or 'COS60011'
    DEBUG = True # Set to False for productions
    DB_USER = 'postgres'
    DB_PASSWORD = '12345678'
    DB_HOST = 'localhost'
    DB_PORT = '5432'
    DB_NAME = 'easyresi'

    SQLALCHEMY_DATABASE_URI = f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}'

    SQLALCHEMY_TRACK_MODIFICATIONS = False