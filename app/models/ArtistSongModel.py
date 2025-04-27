from config.db import db, app, ma

class ArtistsSongs(db.Model):
    __tablename__ = 'tblartists_songs'

    id = db.Column(db.Integer, primary_key = True, autoincrement = True) 
    artistId = db.Column(db.Integer, db.ForeignKey('tblartists.id'), primary_key = True)
    songId = db.Column(db.Integer, db.ForeignKey('tblsongs.id'), primary_key = True)

    def __init__(self, artistId, songId):
        self.artistId = artistId
        self.songId = songId
    
    
