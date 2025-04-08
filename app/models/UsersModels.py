from config.db import app, db, ma

class User(db.Model):
    __tablename__ = 'tbl_users'
    
    id = db.Column(db.Integer, primary_key = True)
    fullname = db.Column(db.String(100))
    email = db.Column(db.String(50))
    
    def __init__(self, fullname, email):  
        self.fullname = fullname
        self.email = email
        
with app.app_context():
    db.create_all()
    
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'fullname', 'email')