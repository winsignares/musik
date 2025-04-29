from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

import bcrypt

#llamamos al modelo de User
from models.UserModel import Users, UsersSchema

route_user = Blueprint("route_user", __name__)

user_schema = UsersSchema()
users_schema = UsersSchema(many=True)

@route_user.route("/get", methods=["GET"])
def getUsers():
    users = Users.query.all()
    respo = users_schema.dump(users)
    return jsonify(respo)

@route_user.route("/register", methods=['POST'])
def registerUser():
    name = request.json['name']
    lastName = request.json['lastName']
    birthDate = request.json['birthDate']
    phoneNumber = request.json['phoneNumber']
    email = request.json['email']
    password = request.json['password']
    hashedPassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    role = "usuario"
    newUser = Users(name, lastName, birthDate, phoneNumber, email, hashedPassword, role)
    db.session.add(newUser)
    db.session.commit()
    return "Usuario registrado correctamente"

@route_user.route("/delete", methods=['DELETE'])
def deleteUser():
    id = request.json['id'] 
    user = Users.query.get(id)    
    db.session.delete(user)
    db.session.commit()     
    return jsonify(user_schema.dump(user))

@route_user.route("/update", methods=['PUT'])
def updateUser():
    id = request.json['id'] 
    user = Users.query.get(id)  
    user.name = request.json['name']  
    user.lastName = request.json['lastName']
    user.birthDate = request.json['birthDate']
    user.phoneNumber = request.json['phoneNumber']
    user.email = request.json['email']
    password = request.json['password']
    hashedPassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user.password = hashedPassword
    db.session.commit()     
    return "Usuario actualizado correctamente"

@route_user.route("/login", methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']

    user = Users.query.filter_by(email=email).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify(user_schema.dump(user)) 
    else:
        return "Correo o contraseña incorrectos"