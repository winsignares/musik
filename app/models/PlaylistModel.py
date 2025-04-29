from config.db import db, app, ma

class Playlists(db.Model):
    __tablename__ = 'tblplaylists'

    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50))
    description = db.Column(db.String(100))
    userId = db.Column(db.Integer, db.ForeignKey('tblusers.id'))

    user = db.relationship('Users', backref = 'playlists')

    def __init__(self, name, description, userId):
        self.name = name
        self.description = description
        self.userId = userId

class PlaylistsSchema(ma.Schema):
    class Meta:
        fields = ('id','name', 'description', 'userId')