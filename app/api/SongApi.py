from flask import Flask, Blueprint, request, redirect, render_template, jsonify
from app.config.db import app, db, ma

from app.models.SongModel import Songs, SongsSchema

route_song = Blueprint("route_song", __name__)

song_schema = SongsSchema()
songs_schema = SongsSchema(many=True)

@route_song.route("/songs", methods=["GET"])
def allSongs():
    resultAll = Songs.query.all()
    respo = songs_schema.dump(resultAll)
    return jsonify(respo)

