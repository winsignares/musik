import json, uuid, os
from werkzeug.utils import secure_filename
from sqlalchemy.orm import joinedload

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

@route_artist.route('/get/<int:id>', methods=['GET'])
def get_artist(id):
    artist = Artists.query.get_or_404(id)
    image_url = f"/static/uploads/artists/{artist.image}" 
    return jsonify({
        'id': artist.id,
        'name': artist.name,
        'image': image_url
    })

def format_duration(seconds):
    minutes = seconds // 60
    sec = seconds % 60
    return f"{minutes}:{sec:02}"

@route_artist.route('/songs/<int:id>', methods=['GET'])
def getSongsbyArtist(id):
    # Primero, verificar que el artista existe
    artist = Artists.query.get_or_404(id)

    # Hacer join entre Songs y ArtistsSongs filtrando por artist_id
    songs = Songs.query.join(ArtistsSongs, Songs.id == ArtistsSongs.songId)\
        .filter(ArtistsSongs.artistId == id)\
        .all()

    result = []

    for song in songs:
        # Obtener artistas asociados a esta canción (otro join manual)
        artist_rows = Artists.query.join(ArtistsSongs, Artists.id == ArtistsSongs.artistId)\
            .filter(ArtistsSongs.songId == song.id).all()

        artist_names = ", ".join([a.name for a in artist_rows])

        result.append({
            'id': song.id,
            'title': song.name,
            'artist_name': artist_names,
            'duration': format_duration(song.duration),
            'cover_image': song.cover,
            'audio_file': song.mp3file,
            'author': song.author
        })

    return jsonify(result)

@route_artist.route("/register", methods=['POST'])
def registerArtist():
    name = request.form.get('name')
    image = request.files['image']

    filename = secure_filename(image.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    image.save(os.path.join(app.config['UPLOAD_FOLDER3'], unique_filename))

    newArtist = Artists(name, unique_filename)
    db.session.add(newArtist)
    db.session.commit()

    return jsonify({"message": "Artista registrado correctamente"})

@route_artist.route("/delete/<int:id>", methods=['DELETE'])
def deleteArtist(id):
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

@route_artist.route("/update/<int:id>", methods=['PUT'])
def updateArtist(id):
    artist = Artists.query.get(id)
    artist.name = request.form.get('name')
    image = request.files['image']

    if image:
        old_image_path = os.path.join(app.config['UPLOAD_FOLDER3'], artist.image)

        if artist.image and os.path.exists(old_image_path):
            os.remove(old_image_path)

    filename = secure_filename(image.filename)
    unique_filename = f"{uuid.uuid4().hex}_{filename}"
    image.save(os.path.join(app.config['UPLOAD_FOLDER3'], unique_filename))
    artist.image = unique_filename
    
    db.session.commit()

    return jsonify({"message": "Artista actualizado correctamente"})
