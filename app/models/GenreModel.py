from config.db import db, app, ma

class Genres(db.Model):
    __tablename__ = 'tblgenres'

    id = db.Column(db.Integer, primary_key = True) 
    name = db.Column(db.String(50))
    description = db.Column(db.String(100))

    def __init__(self, name, description):
        self.name = name
        self.description = description

class GenresSchema(ma.Schema):
    class Meta:
        fields = ('id','name','description')