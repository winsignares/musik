from marshmallow_sqlalchemy import SQLAlchemyAutoSchema

from app.config.db import db, ma

class Genres(db.Model):
    __tablename__ = 'tblgenres'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    description = db.Column(db.String(255))
    fatherId = db.Column(db.Integer, db.ForeignKey('tblgenres.id'))

    def __init__(self, name, description, fatherId):
        self.name = name
        self.description = description
        self.fatherId = fatherId

class GenresSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Genres
        load_instance = True
        include_fk = True