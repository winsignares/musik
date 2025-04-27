from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app.config.db import db, ma

class Playlists(db.Model):
    __tablename__ = 'tblplaylists'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    description = db.Column(db.String(255))
    userId = db.Column(db.Integer, db.ForeignKey('tblusers.id'))

    def __init__(self, name, description, userId):
        self.name = name
        self.description = description
        self.userId = userId

class PlaylistsSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Playlists
        load_instance = True
        include_fk = True