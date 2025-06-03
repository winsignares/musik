from flask import Flask, Blueprint, request, redirect, render_template, jsonify, session
from config.db import app, db, ma

#llamamos al modelo de User
from models.PlaylistModel import Playlists, PlaylistsSchema
from models.PlaylistSongModel import PlaylistsSongs
from models.SongModel import Songs, SongsSchema
from models.ArtistModel import Artists
from models.ArtistSongModel import ArtistsSongs

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

@route_playlist.route("/delete/<int:id>", methods=['DELETE'])
def deletePlaylist(id):
    playlist = Playlists.query.get(id)    
    playlist_songs = PlaylistsSongs.query.filter_by(playlistId = id).all()

    for playlist_song in playlist_songs:
        song_id = playlist_song.songId

        PlaylistsSongs.query.filter_by(playlistId=id).delete()

    db.session.delete(playlist)
    db.session.commit()     
    return jsonify(playlist_schema.dump(playlist))

@route_playlist.route("/update/<int:id>", methods=['PUT'])
def updatePlaylist(id):
    playlist = Playlists.query.get(id)    
    playlist.name = request.json['name']
    playlist.description = request.json['description']
    playlist.userId = session.get('user_id')
    db.session.commit()     
    return "Playlist actualizada correctamente"

@route_playlist.route("/deleteSong/<int:playlist_id>/<int:song_id>", methods=['DELETE'])
def deleteSongfromPlaylist(playlist_id, song_id):
    Playlists.query.get_or_404(playlist_id)
    Songs.query.get_or_404(song_id)
    playlist_song = PlaylistsSongs.query.filter_by(playlistId=playlist_id, songId=song_id).first()
    db.session.delete(playlist_song)
    db.session.commit()

    return "Canción eliminada de la playlist correctamente"

def format_duration(seconds):
    minutes = seconds // 60
    sec = seconds % 60
    return f"{minutes}:{sec:02}"

@route_playlist.route("/songs/<int:id>", methods=["GET"])
def getSongsFromPlaylist(id):
    # (Opcional) Verificar que la playlist existe
    Playlists.query.get_or_404(id)

    # Obtener todas las relaciones de canciones en esta playlist
    playlist_songs = PlaylistsSongs.query.filter_by(playlistId=id).all()

    result = []

    for relation in playlist_songs:
        song = Songs.query.get(relation.songId)

        # Obtener artistas asociados a esta canción
        artist_rows = Artists.query.join(ArtistsSongs, Artists.id == ArtistsSongs.artistId)\
            .filter(ArtistsSongs.songId == song.id).all()

        artist_names = ", ".join([a.name for a in artist_rows])
        main_artist_id = artist_rows[0].id 

        result.append({
            'id': song.id,
            'title': song.name,
            'artist_name': artist_names,
            'artist_id': main_artist_id,
            'duration': format_duration(song.duration),
            'cover_image': song.cover
        })

    return jsonify(result)

@route_playlist.route("/add_song", methods=["POST"])
def addSongToPlaylist():
    data = request.get_json()
    playlist_id = data.get("playlist_id")
    song_id = data.get("song_id")

    if not playlist_id or not song_id:
        return jsonify({"error": "Datos incompletos"}), 400

    # Verificar existencia
    playlist = Playlists.query.get_or_404(playlist_id)
    song = Songs.query.get_or_404(song_id)

    # Verificar si ya existe la relación
    existing = PlaylistsSongs.query.filter_by(playlistId=playlist_id, songId=song_id).first()
    if existing:
        return jsonify({"message": "La canción ya está en la playlist"}), 409

    nuevaRelacion = PlaylistsSongs(playlistId=playlist_id, songId=song_id)
    db.session.add(nuevaRelacion)
    db.session.commit()

    return jsonify({"message": "Canción agregada a la playlist correctamente"}), 200



