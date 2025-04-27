from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

from models.ArtistModel import Artists, ArtistsSchema
from models.SongModel import Songs
from models.ArtistSongModel import ArtistsSongs
from models.GenreSongModel import GenresSongs
from models.PlaylistSongModel import PlaylistsSongs

route_artist = Blueprint("route_artist", __name__)

artist_schema = ArtistsSchema()
artists_schema = ArtistsSchema(many=True)

@route_artist.route("/get", methods=["GET"])
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

    artist_songs = ArtistsSongs.query.filter_by(artistId = id).all()

    for artist_song in artist_songs:
        song_id = artist_song.songId

        ArtistsSongs.query.filter_by(songId = song_id).delete()
        GenresSongs.query.filter_by(songId = song_id).delete()
        PlaylistsSongs.query.filter_by(songId = song_id).delete()

        song = Songs.query.get(song_id)
        db.session.delete(song)

    db.session.delete(artist)
    db.session.commit()     

    return jsonify(artist_schema.dump(artist))

@route_artist.route("/update", methods=['PUT'])
def updateArtist():
    id = request.json['id'] 
    artist = Artists.query.get(id)    
    artist.name = request.json['name']
    db.session.commit()     
    return "Artista actualizado correctamente"
