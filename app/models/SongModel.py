from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app.config.db import db, app, ma

from app.models.GenreModel import Genres
from app.models.GenreSongModel import GenresSongs

class Songs(db.Model):
    __tablename__ = 'tblsongs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    author = db.Column(db.String(50))
    duration = db.Column(db.Integer)
    date = db.Column(db.DateTime)
    cover = db.Column(db.String(255))
    url = db.Column(db.String(255))

    genres = db.relationship(Genres, secondary=GenresSongs, backref='tblsongs', lazy='dynamic')

    def __init__(self, name, author, duration, date, cover, url, genres):
        self.name = name
        self.author = author
        self.duration = duration
        self.date = date
        self.cover = cover
        self.url = url
        self.genres = genres

with app.app_context():
    db.create_all()

class SongsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Songs
        load_instance = True