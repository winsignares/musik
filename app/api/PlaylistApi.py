from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

#llamamos al modelo de User
from models.PlaylistModel import Playlists, PlaylistsSchema

route_playlist = Blueprint("route_playlist", __name__)

playlist_schema = PlaylistsSchema()
playlists_schema = PlaylistsSchema(many=True)

@route_playlist.route("/users", methods=["GET"])
def getPlaylists():
    playlists = Playlists.query.all()
    respo = playlists_schema.dump(playlists)
    return jsonify(respo)

@route_playlist.route("/register", methods=['POST'])
def registerPlaylist():
    name = request.json['name']
    description = request.json['description']
    newPlaylist = Playlists(name, description)
    db.session.add(newPlaylist)
    db.session.commit()
    return "Playlist registrado correctamente"

@route_playlist.route("/delete", methods=['DELETE'])
def deletePlaylist():
    id = request.json['id'] 
    playlist = Playlists.query.get(id)    
    db.session.delete(playlists_schema)
    db.session.commit()     
    return jsonify(playlist_schema.dump(playlist_schema))

