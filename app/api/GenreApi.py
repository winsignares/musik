from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from app.config.db import db, ma

from app.models.GenreModel import Genres, GenresSchema

route_genre = Blueprint("route_genre", __name__)

genre_schema = GenresSchema()
genres_schema = GenresSchema(many=True)

@route_genre.route("/genres", methods=["GET"])
def allGenres():
    resultAll = Genres.query.all()
    respo = genres_schema.dump(resultAll)
    return jsonify(respo)

@route_genre.route("/register", methods=["POST"])
def registerGenre():
    name = request.json.get("name")
    description = request.json.get("description")
    fatherId = request.json.get("fatherId")
    newGenre = Genres(name, description, fatherId)
    db.session.add(newGenre)
    db.session.commit()
    return "Genero registrado con exito"

