from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import db, app, ma

from models.UsersModels import Users, UserSchema

usuario_schema = UserSchema()
usuarios_schema = UserSchema(many=True)


#endpoints

ruta_user = Blueprint('ruta_user', __name__)
@ruta_user.route ('/users', methods=['GET'])
def alluser():
    resultAll = Users.query.all() #select * from users
    resp = usuarios_schema(resultAll)
    return jsonify(resp)

@ruta_user.route('/saveUser', methods=['POST'])
def saveUser():
    fullname = request.json['fullname']
    email = request.json['email']
    newuser = Users(fullname, email)
    db.session.add(newuser)
    db.session.commit()
    return 'Datos guardados con éxito'

@ruta_user.route('/deleteUser', methods=['DELETE'])
def deleteUser():
    id = request.json['id']
    user = Users.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return 'Datos eliminados con éxito'
