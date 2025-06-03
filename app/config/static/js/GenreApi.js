document.addEventListener('DOMContentLoaded', () => {
  getGenres();
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('genre-container');
  const genreId = container?.dataset?.genreId;

  console.log('DOM loaded, container:', container);
  console.log('Genre ID:', genreId);

  if (genreId) {
    getGenrebyId(genreId);
    getSongsbyGenre(genreId);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('genre-container-songs');
  const genreId = container?.dataset?.genreId;

  console.log('DOM loaded, container:', container);
  console.log('Genre ID:', genreId);

  if (genreId) {
    getSongsbyGenre(genreId);
  }
});

function getGenres() {
  axios.get('/api/genres/get')
    .then(response => {
      const genres = response.data;
      const grid = document.getElementById('grid-generos');
      if (!grid) {
        console.error('No se encontró el contenedor #grid-generos');
        return;
      }

      grid.innerHTML = '';

      genres.forEach(genre => {
        const div = document.createElement('div');
        div.innerHTML = `
          <button onclick="window.location.href='/genero/${genre.id}'"
              class="p-4 h-fit w-fit cursor-pointer hover:bg-[#2b2b2e] rounded-3xl duration-200">
              <div class="lg:h-45 lg:w-45 md:h-35 md:w-35 sm:h-30 sm:w-30 h-25 w-25 lg:rounded-[10rem] rounded-[5rem] bg-gradient-to-br from-blue-300 to-blue-800"> </div>
           <h3 class="lg:text-xl md:text-lg sm:text-base text-sm text-white text-start font-semibold hover:underline py-2">
              ${genre.name}
          </h3>
          </button>
        `;
        grid.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Error al cargar generos:', error);
    });
}

function getGenrebyId(id) {
  axios.get(`/api/genres/get/${id}`)
    .then(response => {
      const genre = response.data;
      const container = document.getElementById('genre-container');
      if (!container) return console.error('No se encontró el contenedor #genre-container');

      container.querySelector('.flex').innerHTML = `
        <div class="flex items-center">
          <div class="lg:h-45 lg:w-45 md:h-35 md:w-35 sm:h-30 sm:w-30 h-25 w-25 lg:rounded-[10rem] rounded-[5rem] bg-gradient-to-br from-blue-300 to-blue-800 lg:ml-30 ml-10"> </div>

          <div class="flex flex-col">
            <h2 class="lg:text-4xl lg:px-20 md:text-3xl md:px-14 sm:text-2xl sm:px-8 text-lg px-10 text-white font-bold">${genre.name}</h2>
            <br>
            <h3 class="lg:text-2xl lg:px-20 md:text-3xl md:px-14 sm:text-2xl sm:px-8 text-md px-10 text-gray-400 font-semibold">${genre.description}</h3>
          </div>
        </div>
        `;
    })
    .catch(error => {
      console.error('Error al cargar genero:', error);
    });
}

function getSongsbyGenre(id) {
  console.log('Intentando cargar canciones para artista ID:', id);

  axios.get(`/api/genres/songs/${id}`)
    .then(songRes => {
      const songs = songRes.data;
      console.log('Canciones recibidas:', songs);

      const tbody = document.getElementById('songs-table-body');
      console.log('tbody:', tbody);

      if (!tbody) {
        console.error('No se encontró el tbody de canciones');
        return;
      }

      tbody.innerHTML = '';

      songs.forEach((song, index) => {
        tbody.innerHTML += `
          <tr class="group text-center hover:bg-[#2b2b2b] duration-200">
            <td class="p-4 font-bold text-gray-400 hidden md:table-cell">${index + 1}</td>
            <td class="p-4">

            <div class="flex items-center lg:gap-20 gap-4">
              <div class="relative group h-14 w-14">
                <button class="cursor-pointer">
                  <img src="../../static/uploads/covers/${song.cover_image}" alt="${song.title}" class="rounded-sm h-14 w-14 object-cover" />
              <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 rounded-sm">
                  <img src="/static/img/play-solid.svg" alt="Play" class="h-6 w-6">
              </div>
                </button>
            </div>

              <div class="flex flex-col md:flex-row md:items-center lg:gap-20">
                <a href="/cancion/${song.id}" class="lg:text-lg font-semibold hover:underline">${song.title}</a>
                <a href="/artista/${song.artist_id}" class="lg:text-lg text-sm text-start text-gray-400 hover:underline">
                  ${song.artist_name}
                </a>
              </div>
            </div>

            </td>
            <td class="hidden md:table-cell p-4 lg:text-lg text-sm text-start text-gray-400">${song.duration}</td>
            <td class="p-4">
      <button class="cursor-pointer hover:scale-125 duration-200">
        <img src="/static/img/ellipsis-solid.svg" alt="" class="h-8 w-8">
      </button>
    </td>
  </tr>
`;
      });
    })
    .catch(err => {
      console.error('Error al cargar canciones:', err);
    });
}






