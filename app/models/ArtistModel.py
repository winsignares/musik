from config.db import db, app, ma

class Artists(db.Model):
    __tablename__ = 'tblartists'

    id = db.Column(db.Integer, primary_key = True) 
    name = db.Column(db.String(50))

    def __init__(self, name):
        self.name = name

class ArtistsSchema(ma.Schema):
    class Meta:
        fields = ('id','name')