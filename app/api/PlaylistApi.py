from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

#llamamos al modelo de User
from models.PlaylistModel import Playlists, PlaylistsSchema
from models.PlaylistSongModel import PlaylistsSongs
from models.SongModel import Songs, SongsSchema

route_playlist = Blueprint("route_playlist", __name__)

playlist_schema = PlaylistsSchema()
playlists_schema = PlaylistsSchema(many=True)
song_schema = SongsSchema()
songs_schema = SongsSchema(many=True)

@route_playlist.route("/get", methods=["GET"])
def getPlaylists():
    playlists = Playlists.query.all()
    respo = playlists_schema.dump(playlists)
    return jsonify(respo)

@route_playlist.route("/get/user/<int:id>", methods=["GET"])
def getPlaylistsbyUser(id):
    playlists = Playlists.query.filter_by(userId = id).all()
    return jsonify(playlists_schema.dump(playlists))

@route_playlist.route("/get/<int:id>", methods=["GET"])
def getPlaylistById(id):
    playlist = Playlists.query.get(id)

    return jsonify(playlist_schema.dump(playlist))

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
    playlist_songs = PlaylistsSongs.query.filter_by(playlistId = id).all()

    for playlist_song in playlist_songs:
        song_id = playlist_song.songId

        PlaylistsSongs.query.filter_by(songId = song_id).delete()

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

@route_playlist.route("/addSong", methods=['POST'])
def addSongtoPlaylist():
    playlistId = request.json['playlistId']
    songId = request.json['songId']
    newPlaylistSong = PlaylistsSongs(playlistId, songId)
    db.session.add(newPlaylistSong)
    db.session.commit() 

    return "Canción añadida a la playlist correctamente"

@route_playlist.route("/deleteSong", methods=['DELETE'])
def deleteSongfromPlaylist():
    playlistId = request.json['playlistId']
    songId = request.json['songId']
    playlist_song = PlaylistsSongs.query.filter_by(playlistId = playlistId, songId = songId).first()
    db.session.delete(playlist_song)
    db.session.commit()

    return "Canción eliminada de la playlist correctamente"

@route_playlist.route("/getSongs", methods=["GET"])
def getSongsfromPlaylist():
    playlistId = request.json['playlistId']
    playlist_songs = PlaylistsSongs.query.filter_by(playlistId = playlistId).all()
    songs = []

    for playlist_song in playlist_songs:
        song = Songs.query.get(playlist_song.songId)
        songs.append(song)

    respo = songs_schema.dump(songs)
    return jsonify(respo)



