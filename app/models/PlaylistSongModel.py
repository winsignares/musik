from config.db import db, app, ma

class PlaylistsSongs(db.Model):
    __tablename__ = 'tblplaylists_songs'

    id = db.Column(db.Integer, primary_key = True) 
    playlistId = db.Column(db.Integer, db.ForeignKey('tblplaylists.id'), primary_key = True)
    songId = db.Column(db.Integer, db.ForeignKey('tblsongs.id'), primary_key = True)

    def __init__(self, playlistId, songId):
        self.playlistId = playlistId
        self.songId = songId
    
with app.app_context():
    db.create_all()
    
class PlaylistsSongsSchema(ma.Schema):
    class Meta:
        fields = ('id','playlistId','songId')