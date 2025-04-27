from app.config.db import db, ma

class ArtistsSongs(db.Model):
    __tablename__ = 'tblsongs_artists'

    id = db.Column(db.Integer, primary_key=True)
    artistId = db.Column(db.Integer, db.ForeignKey('tblartists.id'), primary_key=True)
    songId = db.Column(db.Integer, db.ForeignKey('tblsongs.id'), primary_key=True)

    def __init__(self, artistId, songId):
        self.artistId = artistId
        self.songId = songId
