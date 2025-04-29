from config.db import db, app, ma

class PlaylistsSongs(db.Model):
    __tablename__ = 'tblplaylists_songs'

    id = db.Column(db.Integer, primary_key = True, autoincrement = True) 
    playlistId = db.Column(db.Integer, db.ForeignKey('tblplaylists.id'), primary_key = True)
    songId = db.Column(db.Integer, db.ForeignKey('tblsongs.id'), primary_key = True)

    playlist = db.relationship('Playlists', backref='playlists_songs')
    song = db.relationship('Songs', backref='playlists_songs')

    def __init__(self, playlistId, songId):
        self.playlistId = playlistId
        self.songId = songId

