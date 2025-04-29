from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma
from werkzeug.utils import secure_filename

import os, json, uuid

#llamamos al modelo de User
from models.SongModel import Songs, SongsSchema
from models.ArtistSongModel import ArtistsSongs
from models.GenreSongModel import GenresSongs
from models.PlaylistSongModel import PlaylistsSongs

route_song = Blueprint("route_song", __name__)
route_artist_song = Blueprint("route_artist_song", __name__)
route_genre_song = Blueprint("route_genre_song", __name__)
route_playlist_song = Blueprint("route_playlist_song", __name__)

song_schema = SongsSchema()
songs_schema = SongsSchema(many=True)

@route_song.route("/get", methods=["GET"])
def getSongs():
    songs = Songs.query.all()
    respo = songs_schema.dump(songs)
    return jsonify(respo)

@route_song.route("/register", methods=['POST'])
def registerSong():
    data = request.form.get('data')
    data = json.loads(data)
    cover = request.files['cover']
    
    filename = secure_filename(cover.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    cover.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))

    mp3file = request.files['mp3file']

    filename2 = secure_filename(mp3file.filename)
    unique_filename2 = f"{uuid.uuid4().hex}_{filename2}"
    mp3file.save(os.path.join(app.config['UPLOAD_FOLDER2'], unique_filename2))
    
    genre_ids = request.form.getlist('genres')
    artist_ids = request.form.getlist('artists')

    newSong = Songs(data['name'], data['author'], data['duration'], data['date'], unique_filename, unique_filename2)
    db.session.add(newSong)
    db.session.commit()

    for genre_id in genre_ids:
        genreSong = GenresSongs(genreId = genre_id, songId = newSong.id)
        db.session.add(genreSong)

    for artist_id in artist_ids:
        artistSong = ArtistsSongs(artistId = artist_id, songId = newSong.id)
        db.session.add(artistSong)

    db.session.commit()

    return "Canción registrada correctamente"

@route_song.route("/delete", methods=['DELETE'])
def deleteSong():
    id = request.json['id']
    song = Songs.query.get(id)

    GenresSongs.query.filter_by(songId = id).delete()
    ArtistsSongs.query.filter_by(songId = id).delete()
    PlaylistsSongs.query.filter_by(songId = id).delete()

    db.session.delete(song)
    db.session.commit()
    return jsonify(song_schema.dump(song))

@route_song.route("/update", methods=['PUT'])
def updateSong():
    id = request.json['id'] 
    song = Songs.query.get(id)  
    song.name = request.json['name']  
    song.author = request.json['author']
    song.duration = request.json['duration']
    song.date = request.json['date']
    song.cover = request.json['cover']
    song.url = request.json['url']
    db.session.commit() 

    return "Canción actualizada correctamente"







