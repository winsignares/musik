from config.db import db, app, ma

class Songs(db.Model):
    __tablename__ = 'tblsongs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    author = db.Column(db.String(50))
    duration = db.Column(db.Integer)
    date = db.Column(db.Date)
    cover = db.Column(db.String(255))
    mp3file = db.Column(db.String(255))

    def __init__(self, name, author, duration, date, cover, mp3file):
        self.name = name
        self.author = author
        self.duration = duration
        self.date = date
        self.cover = cover
        self.mp3file = mp3file

class SongsSchema(ma.Schema):
    class Meta:
        fields = ('id','name', 'author', 'duration', 'date', 'cover', 'mp3file')