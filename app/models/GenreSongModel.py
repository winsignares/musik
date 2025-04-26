from app.config.db import db, app, ma

class GenresSongs(db.Model):
    __tablename__ = 'tblgenres_songs'

    id = db.Column(db.Integer, primary_key=True)
    genreId = db.Column(db.Integer, db.ForeignKey('tblgenres.id'), primary_key=True)
    songId = db.Column(db.Integer, db.ForeignKey('tblsongs.id'), primary_key=True)

    def __init__(self, genreId, songId):
        self.genreId = genreId
        self.songId = songId

with app.app_context():
    db.create_all()
