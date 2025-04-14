from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import db, app, ma

from models.TaskModel import Task, TaskSchema

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

#endpoints

ruta_task = Blueprint('route_task', __name__)
@ruta_task.route ('/task', methods=['GET'])
def alltask():
    resultAll = Task.query.all() #select * from users
    resp = tasks_schema.dump(resultAll)
    return jsonify(resp)

@ruta_task.route('/registrarTask', methods=['POST'])
def registrarTask():
    nametask = request.json['nametask']
    id_user_fk = request.json['id_user_fk']
    id_category_fk = request.json['id_category_fk']
    newtask = Task(nametask, id_user_fk, id_category_fk)
    db.session.add(newtask)
    db.session.commit()
    return 'Datos guardados con éxito'

@ruta_task.route('/deleteTask', methods=['DELETE'])
def deleteTask():
    id = request.json['id']
    task = Task.query.get(id)
    db.session.delete(task)
    db.session.commit()
    return jsonify(task_schema.dump(task))
