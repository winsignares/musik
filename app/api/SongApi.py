from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma
from werkzeug.utils import secure_filename
from sqlalchemy.orm import joinedload

import os, json, uuid

#llamamos al modelo de User
from models.SongModel import Songs, SongsSchema
from models.ArtistSongModel import ArtistsSongs
from models.GenreSongModel import GenresSongs

route_song = Blueprint("route_song", __name__)
route_artist_song = Blueprint("route_artist_song", __name__)
route_genre_song = Blueprint("route_genre_song", __name__)
route_playlist_song = Blueprint("route_playlist_song", __name__)

song_schema = SongsSchema()
songs_schema = SongsSchema(many=True)

@route_song.route("/get", methods=["GET"])
def getSongs():
    songs = Songs.query.options(
        joinedload(Songs.artists_songs).joinedload(ArtistsSongs.artist),
        joinedload(Songs.genres_songs).joinedload(GenresSongs.genre)
    ).all()

    song_list = []
    for song in songs:
        artists = [asong.artist.name for asong in song.artists_songs]
        genres = [gsong.genre.name for gsong in song.genres_songs]

        song_list.append({
            'id': song.id,
            'name': song.name,
            'author': song.author,
            'duration': song.duration,
            'date': song.date.strftime('%Y-%m-%d'),
            'cover': song.cover,
            'mp3file': song.mp3file,
            'artist': ', '.join(artists),
            'genre': ', '.join(genres)
        })

    return jsonify(song_list)

@route_song.route("/register", methods=['POST'])
def registerSong():
    name = request.form.get('name')
    author = request.form.get('author')
    duration = request.form.get('duration')
    date = request.form.get('date')

    cover = request.files['cover']
    mp3file = request.files['mp3file']

    filename = secure_filename(cover.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    cover.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))

    filename2 = secure_filename(mp3file.filename)
    unique_filename2 = f"{uuid.uuid4().hex}_{filename2}"
    mp3file.save(os.path.join(app.config['UPLOAD_FOLDER2'], unique_filename2))

    genre_ids = request.form.getlist('genre')
    artist_ids = request.form.getlist('artist')

    newSong = Songs(name, author, duration, date, unique_filename, unique_filename2)
    db.session.add(newSong)
    db.session.commit()

    for genre_id in genre_ids:
        db.session.add(GenresSongs(genreId=genre_id, songId=newSong.id))

    for artist_id in artist_ids:
        db.session.add(ArtistsSongs(artistId=artist_id, songId=newSong.id))

    db.session.commit()
    return "Canción registrada correctamente"

@route_song.route("/delete/<int:id>", methods=['DELETE'])
def deleteSong(id):
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
    db.session.commit() 

    return "Canción actualizada correctamente"







