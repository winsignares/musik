from config.db import app, db, ma

class Category(db.Model):
    __tablename__ = 'tbl_category'
    
    id = db.Column(db.Integer, primary_key = True)
    namecategory = db.Column(db.String(100))
    
    def __init__(self, namecategoty):
        self.namecategory = namecategoty  
        
        
with app.app_context():
    db.create_all()
    
class CategorySchema(ma.Schema):
    class Meta:
        fields = ('id', 'namecategory')