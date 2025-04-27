from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

from models.GenreModel import Genres, GenresSchema

route_genre = Blueprint("reoute_genre", __name__)

genre_schema = GenresSchema()
genres_schema = GenresSchema(many=True)

@route_genre.route("/genres", methods=["GET"])
def getGenres():
    genres = Genres.query.all()
    respo = genres_schema.dump(genres)
    return jsonify(respo)

@route_genre.route("/register", methods=['POST'])
def registerGenre():
    name = request.json['name']
    description = request.json['description']
    newGenre = Genres(name, description)
    db.session.add(newGenre)
    db.session.commit()
    return "Genero registrado correctamente"

@route_genre.route("/delete", methods=['DELETE'])
def deleteGenre():
    id = request.json['id'] 
    genre = Genres.query.get(id)    
    db.session.delete(genre)
    db.session.commit()     
    return jsonify(genre_schema.dump(genre))
