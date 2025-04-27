from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from app.config.db import db, ma

from app.models.PlaylistModel import Playlists, PlaylistsSchema
from app.models.UserModel import Users

route_playlist = Blueprint("route_playlist", __name__)

playlist_schema = PlaylistsSchema()
playlists_schema = PlaylistsSchema(many=True)

@route_playlist.route("/playlists", methods=["GET"])
def allPlaylists():
    resultAll = Playlists.query.all()
    respo = playlists_schema.dump(resultAll)
    return jsonify(respo)

@route_playlist.route("/register", methods=["POST"])
def registerPlaylist():
    user = Users.query.get(id)
    name = request.json["name"]
    description = request.json["description"]
    newPlaylist = Playlists(name, description, user)
    db.session.add(newPlaylist)
    db.session.commit()
    return "Playlist registrada con exito"

@route_playlist.route("/playlists/<id>", methods=["GET"])
def getPlaylist(id):
    playlist = Playlists.query.filter_by(userId=id).all()
    respo = playlist_schema.dump(playlist)
    return jsonify(respo)

@route_playlist.route("/delete/<id>", methods=["DELETE"])
def deletePlaylist(id):
    playlist = Playlists.query.get(id)
    db.session.delete(playlist)
    db.session.commit()
    return jsonify(playlist_schema.dump(playlist))

@route_playlist.route("/update/<id>", methods=["PUT"])
def updatePlaylist(id):
    playlist = Playlists.query.get(id)
    name = request.json["name"]
    description = request.json["description"]
    db.session.commit()
    return "Playlist actualizada con exito"