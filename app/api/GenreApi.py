from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

from models.GenreModel import Genres, GenresSchema
from models.SongModel import Songs
from models.GenreSongModel import GenresSongs
from models.ArtistSongModel import ArtistsSongs
from models.PlaylistSongModel import PlaylistsSongs
from models.ArtistModel import Artists


route_genre = Blueprint("route_genre", __name__)

genre_schema = GenresSchema()
genres_schema = GenresSchema(many=True)

@route_genre.route("/get", methods=["GET"])
def getGenres():
    genres = Genres.query.all()
    respo = genres_schema.dump(genres)
    return jsonify(respo)

@route_genre.route('/get/<int:id>', methods=['GET'])
def get_genre(id):
    genre = Genres.query.get_or_404(id)
    return jsonify({
        'id': genre.id,
        'name': genre.name,
        'description': genre.description
    })

def format_duration(seconds):
    minutes = seconds // 60
    sec = seconds % 60
    return f"{minutes}:{sec:02}"

@route_genre.route('/songs/<int:id>', methods=['GET'])
def getSongsbyGenre(id):
    # Verificar que el género existe
    genre = Genres.query.get_or_404(id)

    # Obtener canciones relacionadas al género
    songs = Songs.query.join(GenresSongs, Songs.id == GenresSongs.songId)\
        .filter(GenresSongs.genreId == id).all()

    result = []

    for song in songs:
        # Obtener todos los artistas de la canción
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

@route_genre.route("/register", methods=['POST'])
def registerGenre():
    name = request.json['name']
    description = request.json['description']
    fatherId = request.json.get('fatherId', None)  

    if fatherId == 0:
        fatherId = None

    newGenre = Genres(name, description, fatherId)
    db.session.add(newGenre)
    db.session.commit()
    return "Genero registrado correctamente"

@route_genre.route("/delete/<int:id>", methods=['DELETE'])
def deleteGenre(id):
    genre = Genres.query.get(id)

    if not genre:
        return jsonify({"error": "Género no encontrado"}), 404

    deleted_genres = []

    def delete_genre_and_songs(genre_id):
        subgenres = Genres.query.filter_by(fatherId=genre_id).all()
        for subgenre in subgenres:
            delete_genre_and_songs(subgenre.id)

        genre_songs = GenresSongs.query.filter_by(genreId=genre_id).all()

        for genre_song in genre_songs:
            song_id = genre_song.songId

            ArtistsSongs.query.filter_by(songId=song_id).delete()
            PlaylistsSongs.query.filter_by(songId=song_id).delete()
            GenresSongs.query.filter_by(songId=song_id).delete()

            song = Songs.query.get(song_id)
            if song:
                db.session.delete(song)

        genre_to_delete = Genres.query.get(genre_id)
        if genre_to_delete:
            deleted_genres.append(genre_to_delete)
            db.session.delete(genre_to_delete)

    delete_genre_and_songs(id)
    db.session.commit()
    genres_schema = GenresSchema(many=True)
    return jsonify({"eliminados": genres_schema.dump(deleted_genres)})


@route_genre.route("/update/<int:id>", methods=['PUT'])
def updateGenre(id):
    genre = Genres.query.get(id)    
    genre.name = request.json['name']
    genre.description = request.json['description']
    db.session.commit()     

    return "Género actualizado correctamente"
