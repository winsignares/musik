from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

import bcrypt

#llamamos al modelo de User
from models.UserModel import Users, UsersSchema

route_user = Blueprint("route_user", __name__)
route_admin = Blueprint("route_admin", __name__)

user_schema = UsersSchema()
users_schema = UsersSchema(many=True)

@route_admin.route("/get", methods=["GET"])
def getUsers():
    users = Users.query.all()
    respo = users_schema.dump(users)
    return jsonify(respo)

@route_user.route("/register", methods=['POST'])
def registerUser():
    try:
        data = request.json
        name = data['name']
        lastName = data['lastName']
        birthDate = data['birthDate']
        phoneNumber = data['phoneNumber']
        email = data['email']
        password = data['password']

        existing_user = Users.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "El correo electrónico ya está registrado."}), 409

        hashedPassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        role = "usuario"

        newUser = Users(name, lastName, birthDate, phoneNumber, email, hashedPassword, role)
        db.session.add(newUser)
        db.session.commit()

        return jsonify({"mensaje": "Usuario registrado correctamente."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al registrar usuario: {str(e)}"}), 500

@route_admin.route("/delete/<int:id>", methods=['DELETE'])
def deleteUser(id):
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
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = Users.query.filter_by(email=email).first()

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        user_data = user_schema.dump(user)
        user_data.pop('password', None)  # Quitar la contraseña del JSON
        return jsonify({
            "mensaje": "Inicio de sesión exitoso.",
            "usuario": user_data
        }), 200
    else:
        return jsonify({"error": "Correo o contraseña incorrectos."}), 401