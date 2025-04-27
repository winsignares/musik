from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from app.config.db import db, ma

from app.models.ArtistModel import Artists, ArtistsSchema

route_artist = Blueprint("route_artist", __name__)

artist_schema = ArtistsSchema()
artists_schema = ArtistsSchema(many=True)

@route_artist.route("/artists", methods=["GET"])
def allArtists():
    resultAll = Artists.query.all()
    respo = artists_schema.dump(resultAll)
    return jsonify(respo)

@route_artist.route("/register", methods=["POST"])
def registerArtist():
    name = request.json["name"]
    newArtist = Artists(name)
    db.session.add(newArtist)
    db.session.commit()
    return "Artista registrado con exito"

@route_artist.route("/delete/<id>", methods=["DELETE"])
def deleteArtist(id):
    artist = Artists.query.get(id)
    db.session.delete(artist)
    db.session.commit()
    return jsonify(artist_schema.dump(artist))

@route_artist.route("/update/<id>", methods=["PUT"])
def updateArtist(id):
    artist = Artists.query.get(id)
    artist.name = request.json['name']
    db.session.commit()
    return "Artista actualizado con exito"



