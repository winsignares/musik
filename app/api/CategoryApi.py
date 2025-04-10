from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import db, app, ma

from models.CategoryModel import Category, CategorySchema

category_schema = CategorySchema()
categorys_schema = CategorySchema(many=True)


#endpoints

ruta_category = Blueprint('ruta_category', __name__)
@ruta_category.route ('/category', methods=['GET'])
def allcategory():
    resultAll = Category.query.all() #select * from users
    resp = categorys_schema(resultAll)
    return jsonify(resp)

@ruta_category.route('/saveCategory', methods=['POST'])
def saveCategory():
    namecategory = request.json['namecategory']
    newcategory = Category(namecategory)
    db.session.add(newcategory)
    db.session.commit()
    return 'Datos guardados con éxito'

@ruta_category.route('/deletecategory/<id>', methods=['DELETE'])
def deleteCategory():
    category = Category.query.get(id)
    db.session.delete(category)
    db.session.commit()
    return 'Datos eliminados con éxito'
