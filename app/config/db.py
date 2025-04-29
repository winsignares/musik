from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "/app/config/uploads/covers"
app.config['UPLOAD_FOLDER2'] = "/app/config/uploads/songs"

user = "root"
password = "root"
direc = "db"    
namebd = "musikapp"

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{user}:{password}@{direc}/{namebd}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "Movil2"

db = SQLAlchemy(app)
ma = Marshmallow(app)
