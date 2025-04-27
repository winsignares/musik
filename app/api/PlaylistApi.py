from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

#llamamos al modelo de User
from models.PlaylistModel import Playlists, PlaylistsSchema

route_playlist = Blueprint("route_playlist", __name__)

playlist_schema = PlaylistsSchema()
playlists_schema = PlaylistsSchema(many=True)

@route_playlist.route("/get", methods=["GET"])
def getPlaylists():
    playlists = Playlists.query.all()
    respo = playlists_schema.dump(playlists)
    return jsonify(respo)

@route_playlist.route("/register", methods=['POST'])
def registerPlaylist():
    name = request.json['name']
    description = request.json['description']
    userId = request.json['userId']
    newPlaylist = Playlists(name, description, userId)
    db.session.add(newPlaylist)
    db.session.commit()
    return "Playlist registrada correctamente"

@route_playlist.route("/delete", methods=['DELETE'])
def deletePlaylist():
    id = request.json['id'] 
    playlist = Playlists.query.get(id)    
    db.session.delete(playlist)
    db.session.commit()     
    return jsonify(playlist_schema.dump(playlist))

@route_playlist.route("/update", methods=['PUT'])
def updatePlaylist():
    id = request.json['id'] 
    playlist = Playlists.query.get(id)    
    playlist.name = request.json['name']
    playlist.description = request.json['description']
    playlist.userId = request.json['userId']
    db.session.commit()     
    return "Playlist actualizada correctamente"

