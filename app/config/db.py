import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'static', 'uploads', 'covers')
app.config['UPLOAD_FOLDER2'] = os.path.join(BASE_DIR, 'static', 'uploads', 'songs')
app.config['UPLOAD_FOLDER3'] = os.path.join(BASE_DIR, 'static', 'uploads', 'artists')

user = "root"
password = "root"
direc = "db"    
namebd = "musikapp"

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{user}:{password}@{direc}/{namebd}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = "Movil2"

db = SQLAlchemy(app)
ma = Marshmallow(app)
