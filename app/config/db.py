from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(_name_)

user = "root"
password = "root"
nombrecontainer = "mysql_container"
namedb = "musik-app"

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{user}:{password}@{nombrecontainer}/{namedb}'
app.config['SQLALCHEMY_TRACK:NOTIFICATIONS'] = False
app.secret_key = "ingweb"

db = SQLAlchemy(app)
ma = Marshmallow(app)