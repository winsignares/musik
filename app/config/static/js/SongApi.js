document.addEventListener('DOMContentLoaded', () => {
  getSongs();
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('song-container');
    const songId = container.dataset.songId;
    if (songId) {
      getSongbyId(songId);
    }
  });

function getSongs() {
  axios.get('/api/songs/get')
    .then(response => {
      const songs = response.data;
      const grid = document.getElementById('grid-canciones');
      if (!grid) {
        console.error('No se encontró el contenedor #grid-canciones');
        return;
      }

      grid.innerHTML = '';

      songs.forEach(song => {
        const div = document.createElement('div');
        div.innerHTML = `
          <button onclick="window.location.href='/cancion/${song.id}'"
              class="p-4 h-fit w-fit cursor-pointer hover:bg-[#2b2b2e] rounded-3xl duration-200">
            <img src="../../static/uploads/covers/${song.cover}" alt="${song.name}"
              class="lg:h-45 lg:w-45 md:h-35 md:w-35 sm:h-30 sm:w-30 h-25 w-25 lg:rounded-lg rounded-md">
           <h3 class="lg:text-xl md:text-lg sm:text-base text-sm text-white text-start font-semibold hover:underline py-2">
              ${song.name}
          </h3>
          </button>
        `;
        grid.appendChild(div);
      });
    })
    .catch(error => {
      console.error('Error al cargar canciones:', error);
    });
}

function getSongbyId(id) {
  axios.get(`/api/songs/get/${id}`)
    .then(response => {
      const song = response.data;
      const container = document.getElementById('song-container');
      if (!container) return console.error('No se encontró el contenedor #song-container');

      container.innerHTML = `
        <div class="flex flex-col items-center justify-center lg:justify-start lg:flex-row lg:pl-30 md:pl-20 sm:pl-10 lg:pb-20 pb-10">
          <img src="${song.cover}" alt="${song.name}"
              class="lg:h-[15rem] lg:w-[15rem] md:h-[10rem] md:w-[10rem] sm:h-[7rem] sm:w-[7rem] h-50 w-50 rounded-lg mb-4 lg:mb-0">

          <div class="flex flex-col items-center lg:items-start justify-center">
              <h2
                  class="lg:text-4xl md:text-3xl sm:text-2xl text-2xl text-white font-bold lg:text-left text-center lg:px-20 px-10">
                  ${song.name}
              </h2>
              <br>
              <h3
                  class="lg:text-2xl md:text-xl sm:text-xl text-lg text-white font-semibold lg:text-left text-center lg:px-20 px-10">
                  <a href="/artista/${song.artist_ids[0]}" class="hover:underline">${song.artist}</a>
              </h3>
              <br>
              <h4
                  class="lg:text-xl md:text-lg sm:text-lg text-md text-gray-400 lg:text-left text-center lg:px-20 px-10">
                  <a href="/genero/${song.genre_ids[0]}" class="hover:underline">${song.genre}</a>
              </h4>
          </div>
        </div>

        <table class="w-full text-white">
                <tbody>
                    <tr class="group text-center hover:bg-[#2b2b2b] duration-200">
                        <td class="p-4 font-bold text-gray-400 hidden md:table-cell">1</td>
                        <td class="p-4">
                            <div class="flex items-center lg:gap-20 gap-4">
                                <div class="relative group h-14 w-14">
                                    <img src="${song.cover}" alt=""
                                        class="rounded-sm h-14 w-14 object-cover" />
                                    <div
                                        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 rounded-sm">
                                        <img src="/static/img/play-solid.svg" alt="Play"
                                            class="h-6 w-6">
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row md:items-center lg:gap-20">
                                    <a class="lg:text-lg font-semibold hover:underline">${song.name}</a>
                                    <a href="/artista"
                                        class="lg:text-lg text-sm text-start text-gray-400 hover:underline">${song.artist}</a>
                                </div>
                            </div>
                        </td>
                        <td class="hidden md:table-cell p-4 text-gray-400">${song.duration}</td>
                        <td class="p-4">
                            <button class="cursor-pointer hover:scale-125 duration-200">
                                <img src="/static/img/ellipsis-solid.svg" alt=""
                                    class="h-8 w-8">
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
      `;
    })
    .catch(error => {
      console.error('Error al cargar la canción:', error);
    });
}




