from flask import Flask, request, redirect, render_template, session
from config.db import db, app

# trabajar en las rutas de bluprint con respectos a las api's

from api.UserApi import route_user, route_admin
from api.ArtistApi import route_artist
from api.GenreApi import route_genre
from api.PlaylistApi import route_playlist
from api.SongApi import route_song, route_artist_song, route_genre_song, route_playlist_song

# Importar los Blueprints

app.register_blueprint(route_admin, url_prefix="/api/admin")
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

@app.route("/adminUsers")
def adminUsers():
    return render_template("admin/Ausuarios.html")

@app.route("/adminArtists")
def adminArtists():
    return render_template("admin/Aartistas.html")

@app.route("/adminGenres")
def adminGenres():
    return render_template("admin/Ageneros.html")

@app.route("/adminSongs")
def adminSongs():
    return render_template("admin/Acanciones.html")
    
@app.route("/registro")
def registro():
    return render_template("user/registro.html")

@app.route("/sesion")
def sesion():
    return render_template("user/sesion.html")

@app.route("/perfil/<int:id>")
def perfil(id):
    return render_template("user/Perfil.html", id=id)

@app.route("/principal")
def principal():
    return render_template("user/principal.html")

@app.route("/artistas")
def artistas():
    return render_template("user/Artistas.html")

@app.route("/artista/<int:id>")
def artista(id):
    if 'user_id' not in session:
        return redirect('/login')
    return render_template("user/Artista.html", artist_id=id, user_id=session['user_id'])

@app.route("/canciones")
def canciones():
    return render_template("user/Canciones.html")

@app.route("/cancionesArtista/<int:id>")
def cancionesArtista(id):
    return render_template("user/CancionesArtista.html", artist_id=id)

@app.route("/cancionesGenero/<int:id>")
def cancionesGenero(id):
    return render_template("user/CancionesGenero.html", genre_id=id)

@app.route("/cancion/<int:id>")
def cancion(id):
    return render_template("user/Cancion.html", song_id=id)

@app.route("/generos")
def generos():
    return render_template("user/Generos.html")

@app.route("/genero/<int:id>")
def genero(id):
    return render_template("user/Genero.html", genre_id=id)

@app.route("/playlists/<int:id>")
def playlists(id):
    return render_template("user/Playlists.html", user_id=id)

@app.route("/playlist/<int:id>")
def playlist(id):
    return render_template("user/playlistUser.html", playlist_id=id)

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="0.0.0.0")
