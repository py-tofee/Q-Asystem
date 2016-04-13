# -*- coding:utf-8 -*-
import os

from flask import Flask, abort, make_response, request, Response
from flask.ext import restful
# from flask.ext.restful import reqpares, Api
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.bcrypt import Bcrypt
from flask.ext.httpauth import HTTPBasicAuth

import json
from aiohttp import web
from functools import wraps

basedir = os.path.join(os.path.abspath(os.path.dirname(__file__)), '../')

app = Flask(__name__)
app.config.from_object('App.config')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'App.Q&Asystem')
db = SQLAlchemy(app)

# api = restful.Api(app)

flask_bcrypt = Bcrypt(app)

auth = HTTPBasicAuth()

# @app.after_request
# def after_request(response):
# 	response.headers.add('Access-Control-Allow-Origin', '*')
# 	response.headers.add('Access-Control-Allow-Headers', 'Qrigin, X-Requested-With, Content-Type, Authorization, Accept, X-ID, X-TOKEN, X-ANY-YOUR-CUSTOM-HEADER')
# 	response.headers.add('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS, DELETE')

# 	return response
import App.loginserver