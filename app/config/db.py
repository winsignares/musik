from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
ma = Marshmallow()

def createApp():
    app = Flask(__name__, template_folder='templates', static_folder='static')

    user = "root"
    password = "root"
    direc = "db"
    namebd = "musik-app"

    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{user}:{password}@{direc}/{namebd}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.secret_key = "Movil2"

    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        from app.models.ArtistModel import Artists
        from app.models.ArtistSongModel import ArtistsSongs
        from app.models.GenreModel import Genres
        from app.models.GenreSongModel import GenresSongs
        from app.models.PlaylistModel import Playlists
        from app.models.PlaylistSongModel import PlaylistsSongs
        from app.models.SongModel import Songs
        from app.models.UserModel import Users
        db.create_all()
    return app


