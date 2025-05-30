from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma
from werkzeug.utils import secure_filename
from sqlalchemy.orm import joinedload
from datetime import datetime

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

@route_song.route('/get/<int:id>', methods=['GET'])
def get_song(id):
    song = Songs.query.options(
        joinedload(Songs.artists_songs).joinedload(ArtistsSongs.artist),
        joinedload(Songs.genres_songs).joinedload(GenresSongs.genre)
    ).get(id)

    if not song:
        return jsonify({'error': 'Canción no encontrada'}), 404

    artists = [asong.artist.name for asong in song.artists_songs]
    genres = [gsong.genre.name for gsong in song.genres_songs]
    artist_ids = [asong.artist.id for asong in song.artists_songs]
    genre_ids = [gsong.genre.id for gsong in song.genres_songs]

    cover_url = f"/static/uploads/covers/{song.cover}" 
    mp3file_url = f"/static/uploads/songs/{song.mp3file}"

    return jsonify({
        'id': song.id,
        'name': song.name,
        'author': song.author,
        'duration': song.duration,
        'date': song.date.strftime('%Y-%m-%d'),
        'cover': cover_url,
        'mp3file': mp3file_url,
        'artist': ', '.join(artists),
        'genre': ', '.join(genres),
        'artist_ids': artist_ids,
        'genre_ids': genre_ids
    })

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
        db.session.add(GenresSongs(genreId=int(genre_id), songId=newSong.id))

    for artist_id in artist_ids:
        db.session.add(ArtistsSongs(artistId=int(artist_id), songId=newSong.id))

    db.session.commit()
    return "Canción registrada correctamente"

@route_song.route("/delete/<int:id>", methods=['DELETE'])
def deleteSong(id):
    song = Songs.query.get(id)

    GenresSongs.query.filter_by(songId = id).delete()
    ArtistsSongs.query.filter_by(songId = id).delete()

    db.session.delete(song)
    db.session.commit()
    return jsonify(song_schema.dump(song))

@route_song.route("/update/<int:id>", methods=['PUT'])
def updateSong(id):
    song = Songs.query.get_or_404(id)

    # Actualización de campos simples
    song.name = request.form.get('name')
    song.author = request.form.get('author')
    song.duration = request.form.get('duration')
    song.date = datetime.strptime(request.form.get('date'), "%Y-%m-%d")

    # Actualización de archivos
    cover = request.files.get('cover')
    mp3file = request.files.get('mp3file')

    if cover:
        old_cover_path = os.path.join(app.config['UPLOAD_FOLDER'], song.cover)
        if song.cover and os.path.exists(old_cover_path):
            os.remove(old_cover_path)
        filename = secure_filename(cover.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        cover.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))
        song.cover = unique_filename

    if mp3file:
        old_mp3_path = os.path.join(app.config['UPLOAD_FOLDER2'], song.mp3file)
        if song.mp3file and os.path.exists(old_mp3_path):
            os.remove(old_mp3_path)
        filename2 = secure_filename(mp3file.filename)
        unique_filename2 = f"{uuid.uuid4().hex}_{filename2}"
        mp3file.save(os.path.join(app.config['UPLOAD_FOLDER2'], unique_filename2))
        song.mp3file = unique_filename2

    # Limpiar relaciones existentes de artistas y géneros
    song.artists_songs.clear()
    song.genres_songs.clear()

    # Agregar nuevos artistas
    artist_ids = request.form.getlist('artist')
    for artist_id in artist_ids:
        artist = Artists.query.get(int(artist_id))
        if artist:
            song.artists_songs.append(ArtistsSongs(artist=artist))

    # Agregar nuevos géneros
    genre_ids = request.form.getlist('genre')
    for genre_id in genre_ids:
        genre = Genres.query.get(int(genre_id))
        if genre:
            song.genres_songs.append(GenresSongs(genre=genre))

    db.session.commit()
    return jsonify({"message": "Canción actualizada correctamente"})








