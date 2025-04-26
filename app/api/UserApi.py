from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from app.config.db import db, ma

#llamamos al modelo de User
from app.models.UserModel import Users, UsersSchema

route_user = Blueprint("route_user", __name__)

user_schema = UsersSchema()
users_schema = UsersSchema(many=True)

@route_user.route("/users", methods=["GET"])
def allUsers():
    resultAll = Users.query.all()
    respo = users_schema.dump(resultAll)
    return jsonify(respo)

@route_user.route("/register", methods=['POST'])
def registerUser():
    name = request.json['name']
    lastName = request.json['lastname']
    birthDate = request.json['birthdate']
    phoneNumber = request.json['phoneNumber']
    email = request.json['email']
    password = request.json['password']
    newUser = Users(name, lastName, birthDate, phoneNumber, email, password)
    db.session.add(newUser)
    db.session.commit()
    return "Usuario registrado con exito"

@route_user.route("/delete/<id>", methods=['DELETE'])
def deleteUser(id):
    user = Users.query.get(id)
    db.session.delete(user)
    db.session.commit()     
    return jsonify(user_schema.dump(usuario))

@route_user.route("/update/<id>", methods=['PUT'])
def updateUser(id):
    user = Users.query.get(id)
    user.nameUser = request.json['name']
    user.lastNameUser= request.json['lastname']
    user.birthDateUser = request.json['birthdate']
    user.phoneNumberUser = request.json['phoneNumber']
    user.emailUser = request.json['email']
    user.passwordUser = request.json['password']
    db.session.commit()
    return "Usuario actualizado con exito"
