from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

from models.ArtistModel import Artists, ArtistsSchema

route_artist = Blueprint("route_artist", __name__)

artist_schema = ArtistsSchema()
artists_schema = ArtistsSchema(many=True)

@route_artist.route("/artists", methods=["GET"])
def getArtists():
    artists = Artists.query.all()
    respo = artists_schema.dump(artists)
    return jsonify(respo)

@route_artist.route("/register", methods=['POST'])
def registerArtist():
    name = request.json['name']
    newArtist = Artists(name)
    db.session.add(newArtist)
    db.session.commit()
    return "Artista registrado correctamente"

@route_artist.route("/delete", methods=['DELETE'])
def deleteArtist():
    id = request.json['id'] 
    artist = Artists.query.get(id)    
    db.session.delete(artist)
    db.session.commit()     
    return jsonify(artist_schema.dump(artist))
