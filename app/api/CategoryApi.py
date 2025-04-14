from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import db, app, ma

from models.CategoryModel import Category, CategorySchema

category_schema = CategorySchema()
categorys_schema = CategorySchema(many=True)


#endpoints

ruta_category = Blueprint('route_category', __name__)


@ruta_category.route ('/categories', methods=['GET'])
def getAllCategories():
    categories = Category.query.all() #select * from users
    result = categorys_schema.dump(categories)
    return jsonify(result)

@ruta_category.route('/addCategory', methods=['POST'])
def addCategory():
    namecategory = request.json['namecategory']
    newcategory = Category(namecategory)
    db.session.add(newcategory)
    db.session.commit()
    return 'Datos guardados con éxito'

@ruta_category.route('/deleteCategory/<id>', methods=['DELETE'])
def deleteCategory(id):
    category = Category.query.get(id)
    db.session.delete(category)
    db.session.commit()
    return 'Datos eliminados con éxito'

@ruta_category.route('/updateCategory', methods=['PUT'])
def updateCategory():
    id = request.json['id']
    category = Category.query.get(id)
    category.namecategory = request.json['namecategory']
    db.session.commit()
    return 'Datos guardados con éxito'

if __name__ == 'main':
    app.run(debug=True)

