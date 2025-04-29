from config.db import db, app, ma

class Genres(db.Model):
    __tablename__ = 'tblgenres'

    id = db.Column(db.Integer, primary_key = True) 
    name = db.Column(db.String(50))
    description = db.Column(db.String(100))
    fatherId = db.Column(db.Integer, db.ForeignKey('tblgenres.id'), nullable=True)
    
    def __init__(self, name, description, fatherId = None):
        self.name = name
        self.description = description
        self.fatherId = fatherId

class GenresSchema(ma.Schema):
    class Meta:
        fields = ('id','name','description', 'fatherId')