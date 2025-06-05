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
          <img src="../../static/uploads/covers/${song.cover_image}" alt="${song.title}"
              class="lg:h-[15rem] lg:w-[15rem] md:h-[10rem] md:w-[10rem] sm:h-[7rem] sm:w-[7rem] h-50 w-50 rounded-lg mb-4 lg:mb-0">

          <div class="flex flex-col items-center lg:items-start justify-center">
              <h2
                  class="lg:text-4xl md:text-3xl sm:text-2xl text-2xl text-white font-bold lg:text-left text-center lg:px-20 px-10">
                  ${song.title}
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

        <table class="text-white lg:mx-20 mx-4">
                <tbody>
                    <tr class="group text-center hover:bg-[#2b2b2b] duration-200">
                        <td class="p-4 font-bold text-gray-400 hidden md:table-cell">1</td>
                        <td class="p-4">
                            <div class="flex items-center">
                                <div class="relative group h-14 w-14">
                                    <button class="cursor-pointer" onclick="playSong('${song.audioFile}', '${song.title}', '${song.artist}', '${song.cover_image}')">
                                        <img src="../../static/uploads/covers/${song.cover_image}" alt="${song.title}" class="rounded-sm h-14 w-14 object-cover" />
                                      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 rounded-sm">
                                        <img src="/static/img/play-solid.svg" alt="Play" class="h-6 w-6">
                                       </div>
                                    </button>
                                </div>

                                <div class="flex flex-col md:flex-row md:items-center lg:gap-[12rem]">
                                    <a class="lg:text-lg font-semibold text-start lg:pl-10 pl-4">${song.title}</a>
                                    <a href="/artista"
                                        class="lg:text-lg text-sm text-start text-gray-400 hover:underline lg:pl-10 pl-4">${song.artist}</a>
                                </div>
                            </div>
                        </td>
                        <td class="hidden md:table-cell p-4 text-gray-400 pr-30">${song.duration}</td>

                        <td class="p-4 relative">
              <button onclick="toggleMenu2(event, ${song.id})" class="cursor-pointer hover:scale-110 duration-200">
                <img src="/static/img/option.png" alt="" class="h-8 w-8">
              </button>

              <div id="menu-opciones" class="absolute right-0 mt-2 lg:w-50 md:w-40 sm:w-35 w-30 bg-white rounded-lg hidden z-50 shadow-lg">
                <ul class="lg:text-lg md:text-base sm:text-sm text-xs">

                  <li onmouseover="mostrarSubmenu()" onmouseout="ocultarSubmenu()">
                    <a onmouseover="cargarPlaylistsEnSubmenu()" class="cursor-pointer block px-4 py-2 hover:bg-gray-200 rounded-lg text-black font-bold">
                      Agregar a playlist
                    </a>

                    <ul id="submenu-playlists" class="absolute left-full top-0 ml-1 w-40 bg-white rounded-lg shadow-lg hidden z-50">

                    </ul>
                  </li>

                  <li>
                    <a onclick="abrirModalCreditos()" class="cursor-pointer block px-4 py-2 hover:bg-gray-200 rounded-lg text-black font-bold">
                      Ver créditos
                    </a>
                  </li>
                </ul>
              </div>
            </td>

            <div id="modal-creditos" class="fixed inset-0 backdrop-blur-sm bg-black/60 hidden z-50 flex items-center justify-center p-4">
    <div class="bg-[#1a1a1a] w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl rounded-2xl shadow-xl p-6">
        <h2 class="text-2xl font-bold text-white mb-4">Créditos</h2>

        <form id="form-editar" class="space-y-4">
            <p class="text-white text-base sm:text-lg">Escrito por: <span class="font-semibold">${song.author}</span></p>
            <p class="text-white text-base sm:text-lg">Cantado por: <span class="font-semibold">${song.artist}</span></p>

            <div class="flex justify-end">
                <button type="button" onclick="cerrarModalCreditos()"
                    class="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-lg transition duration-200">
                    Ok
                </button>
            </div>
        </form>
    </div>
</div>
                    </tr>
                </tbody>
            </table>
      `;
    })
    .catch(error => {
      console.error('Error al cargar la canción:', error);
    });
}

let isPlaying = true;
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = document.getElementById('play-pause-icon');
const progressBar = document.getElementById('progress-bar');
const volumeControl = document.getElementById('volume-control');

function playSong(audioFile, title, artist, coverImage) {
  const container = document.getElementById('audio-player-container');
  document.getElementById('player-title').textContent = title;
  document.getElementById('player-artist').textContent = artist;
  document.getElementById('player-cover').src = `/static/uploads/covers/${coverImage}`;

  audio.src = `/static/uploads/songs/${audioFile}`;
  container.classList.remove('hidden');
  audio.play();
  isPlaying = true;
  playPauseIcon.src = '/static/img/pause-solid.svg';
}

// Play/Pause toggle
playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    playPauseIcon.src = '/static/img/play-solid.svg';
  } else {
    audio.play();
    playPauseIcon.src = '/static/img/pause-solid.svg';
  }
  isPlaying = !isPlaying;
});

// Update progress bar
audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0;
});

// Seek song
progressBar.addEventListener('input', () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');

audio.addEventListener('loadedmetadata', () => {
  totalDurationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});
