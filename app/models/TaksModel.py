from config.db import app, db, ma

class Taks(db.Model):
    __tablename__ = 'tbl_taks'
    
    id = db.Column(db.Integer, primary_key = True)
    nametaks = db.Column(db.String(100))
    id_user_fk = db.Column(db.Integer, db.ForeignKey('tbl_users.id'))
    id_category_fk = db.Column(db.Integer, db.ForeignKey('tbl_category.id'))
    
    def __init__(self, nametaks, id_user_fk, id_category_fk):
        self.nametaks = nametaks
        self.id_user_fk = id_user_fk
        self.id_category_fk = id_category_fk
        
        
with app.app_context():
    db.create_all()
    
class CategorySchema(ma.Schema):
    class Meta:
        fields = ('id', 'nametaks', 'id_user_fk', 'id_category_fk')