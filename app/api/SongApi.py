from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from config.db import app, db, ma

#llamamos al modelo de User
from models.SongModel import Songs, SongsSchema
from models.ArtistSongModel import ArtistsSongs, ArtistsSongsSchema
from models.GenreSongModel import GenresSongs, GenresSongsSchema
from models.PlaylistSongModel import PlaylistsSongs, PlaylistsSongsSchema

route_song = Blueprint("route_song", __name__)
route_artist_song = Blueprint("route_artist_song", __name__)
route_genre_song = Blueprint("route_genre_song", __name__)
route_playlist_song = Blueprint("route_playlist_song", __name__)

