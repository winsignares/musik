from config.db import db, app, ma

class Users(db.Model):
    __tablename__ = 'tblusers'

    id = db.Column(db.Integer, primary_key = True) 
    name = db.Column(db.String(50))
    lastName = db.Column(db.String(50))
    birthDate = db.Column(db.Date)
    phoneNumber = db.Column(db.String(50))
    email = db.Column(db.String(50))
    password = db.Column(db.String(255))
    role = db.Column(db.String(50))

    def __init__(self, name, lastName, birthDate, phoneNumber, email, password, role):
        self.name = name
        self.lastName = lastName
        self.birthDate = birthDate
        self.phoneNumber = phoneNumber
        self.email = email
        self.password = password
        self.role = role
    
class UsersSchema(ma.Schema):
    class Meta:
        fields = ('id','name','lastName','birthDate','phoneNumber','email','password','role')