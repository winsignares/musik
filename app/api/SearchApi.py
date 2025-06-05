from flask import Blueprint, request, jsonify
from models.SongModel import Songs
from models.ArtistModel import Artists
from models.GenreModel import Genres
from models.ArtistSongModel import ArtistsSongs
from sqlalchemy import or_

route_search = Blueprint('route_search', __name__)

@route_search.route('/buscar')
def buscar():
    query = request.args.get('q', '').strip().lower()
    
    if not query:
        return jsonify({'canciones': [], 'artistas': [], 'generos': []})

    # Busca canciones por nombre o autor (texto libre)
    canciones = Songs.query.filter(
        or_(
            Songs.name.ilike(f'%{query}%'),
            Songs.author.ilike(f'%{query}%')
        )
    ).all()

    # Para cada canción, obtenemos los artistas relacionados via tabla intermedia
    canciones_result = []
    for c in canciones:
        artistas_relacionados = [ar.artist.name for ar in c.artists_songs]  # relación backref
        canciones_result.append({
            'id': c.id,
            'name': c.name,
            'artists': artistas_relacionados
        })

    artistas = Artists.query.filter(Artists.name.ilike(f'%{query}%')).all()
    generos = Genres.query.filter(Genres.name.ilike(f'%{query}%')).all()

    resultados = {
        'canciones': canciones_result,
        'artistas': [{'id': a.id, 'name': a.name} for a in artistas],
        'generos': [{'id': g.id, 'name': g.name} for g in generos],
    }

    return jsonify(resultados)
