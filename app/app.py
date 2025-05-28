from flask import Flask, request, redirect, render_template
from config.db import db, app

# trabajar en las rutas de bluprint con respectos a las api's

from api.UserApi import route_user
from api.ArtistApi import route_artist
from api.GenreApi import route_genre
from api.PlaylistApi import route_playlist
from api.SongApi import route_song, route_artist_song, route_genre_song, route_playlist_song

# Importar los Blueprints

app.register_blueprint(route_user, url_prefix="/api/users")
app.register_blueprint(route_artist, url_prefix="/api/artists")
app.register_blueprint(route_genre, url_prefix="/api/genres")
app.register_blueprint(route_playlist, url_prefix="/api/playlists")
app.register_blueprint(route_song, url_prefix="/api/songs")
app.register_blueprint(route_artist_song, url_prefix="/api/artist-song")
app.register_blueprint(route_genre_song, url_prefix="/api/genre-song")
app.register_blueprint(route_playlist_song, url_prefix="/api/playlist-song")

# config el servidor

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/registro")
def registro():
    return render_template("user/registro.html")

@app.route("/sesion")
def sesion():
    return render_template("user/sesion.html")

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
