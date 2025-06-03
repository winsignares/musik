document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('playlist-detail-container');
    const playlistId = container?.dataset?.playlistId;
  
    console.log('DOM loaded, container:', container);
    console.log('Playlist ID:', playlistId);
  
    if (playlistId) {
      getPlaylistById(playlistId);
      getSongsbyPlaylist(playlistId);
    }
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('playlist-container');
    const userId = container?.dataset?.userId;
  
    console.log('DOM loaded, container:', container);
    console.log('User ID:', userId);
  
    if (userId) {
      getPlaylists(userId);
    }
  });
  
  function abrirModalAgregar() {
    document.getElementById('form-agregar').reset();
    document.getElementById('modal-agregar').classList.remove('hidden');
    document.getElementById('modal-agregar').classList.add('flex');
  }
  
  function cerrarModalAgregar() {
    document.getElementById('modal-agregar').classList.remove('flex');
    document.getElementById('modal-agregar').classList.add('hidden');
    document.getElementById('form-agregar').reset();
  }

  function abrirModalEditar(id) {
  document.getElementById('modal-editar').classList.remove('hidden');
  document.getElementById('modal-editar').classList.add('flex');

  axios.get(`/api/playlists/get/${id}`)
    .then(response => {
      const playlist = response.data;
      console.log(playlist);

      document.querySelector('#form-editar input[name="name"]').value = playlist.name;
      document.querySelector('#form-editar input[name="description"]').value = playlist.description;
      document.getElementById('form-editar').dataset.playlistId = id;

    })
    .catch(error => {
      Swal.fire(
        'Error',
        'No se pudo cargar la playlist.',
        'error'
      );
      console.log(error);
    });
}
  
  function cerrarModalEditar() {
    document.getElementById('modal-editar').classList.remove('flex');
    document.getElementById('modal-editar').classList.add('hidden');
    document.getElementById('form-editar').reset();
  }
  
  function registerPlaylist() {
    const name = document.querySelector('[name="name"]').value;
    const description = document.querySelector('[name="description"]').value;
    const userId = document.getElementById('playlist-container').dataset.userId;
  
    axios.post('/api/playlists/register', { name, description, userId })
      .then(() => {
        cerrarModalAgregar();
        
        Swal.fire({
          icon: 'success',
          title: '¡Playlist creada!',
          text: 'Tu playlist se creó correctamente.',
        });
  
        getPlaylists(userId); 
      })
      .catch(error => {
        console.error('Error al crear playlist:', error);
      });
  }
  
  function getPlaylists(id) {
    axios.get(`/api/playlists/get/user/${id}`)
      .then(response => {
        const playlists = response.data;
        const container = document.getElementById('playlist-container');
        if (!container) return console.error('No se encontró el contenedor #playlist-container');
  
        container.innerHTML = '';
  
        playlists.forEach(playlist => {
          const html = `
            <div>
              <button onclick="window.location.href='/playlist/${playlist.id}'"
                class="p-4 h-fit w-fit cursor-pointer hover:bg-[#2b2b2e] rounded-3xl duration-200">
                <div class="lg:h-45 lg:w-45 md:h-35 md:w-35 sm:h-30 sm:w-30 h-25 w-25 lg:rounded-lg rounded-[5rem] bg-gradient-to-br from-blue-300 to-blue-800"></div>
                <h3 class="lg:text-xl md:text-lg sm:text-base text-sm text-white text-start font-semibold hover:underline py-2">
                  ${playlist.name}
                </h3>
              </button>
            </div>
          `;
          container.insertAdjacentHTML('beforeend', html);
        });
      })
      .catch(error => {
        console.error('Error al cargar playlists:', error);
      });
  }
  
  function getPlaylistById(id) {
    axios.get(`/api/playlists/get/${id}`)
      .then(response => {
        const playlist = response.data;
        const container = document.getElementById('playlist-detail-container');
        if (!container) return console.error('No se encontró el contenedor #playlist-detail-container');
  
        container.querySelector('.flex').innerHTML = `
          <div class="flex items-center">
            <div class="lg:h-45 lg:w-45 md:h-35 md:w-35 sm:h-30 sm:w-30 h-25 w-25 lg:rounded-lg bg-gradient-to-br from-blue-300 to-blue-800 lg:ml-30 ml-10"> </div>
  
            <div class="flex flex-col">
              <h2 class="lg:text-4xl lg:px-20 md:text-3xl md:px-14 sm:text-2xl sm:px-8 text-lg px-10 text-white font-bold">${playlist.name}</h2>
              <br>
              <h3 class="lg:text-2xl lg:px-20 md:text-3xl md:px-14 sm:text-2xl sm:px-8 text-md px-10 text-gray-400 font-semibold">${playlist.description}</h3>
            </div>

            <div class="flex flex-col gap-4 ml-[45rem]">
              <button onclick="abrirModalEditar(${playlist.id})" class="cursor-pointer text-white bg-[#3228EC] p-2 hover:bg-[#1810BA] hover:scale-110 duration-200 font-bold text-lg rounded-lg"> Editar </button>
              <button onclick="confirmarEliminacion(${playlist.id})" class="cursor-pointer text-white bg-red-500 p-2 hover:bg-red-700 hover:scale-110 duration-200 font-bold text-lg rounded-lg"> Eliminar </button>
            </div>
          </div>
          `;
      })
      .catch(error => {
        console.error('Error al cargar playlist:', error);
      });
  }

  function getSongsbyArtist(id) {
  console.log('Intentando cargar canciones para artista ID:', id);

  axios.get(`/api/artists/songs/${id}`)
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
                <a class="lg:text-lg text-sm text-start text-gray-400">${song.artist_name}</a>
              </div>
            </div>

            </td>
            <td class="hidden md:table-cell p-4 lg:text-lg text-sm text-start text-gray-400">${song.duration}</td>
            
            <td class="p-4 relative">
              <button onclick="toggleMenuCancion(event)" data-menu-id="menu-${song.id}" class="cursor-pointer hover:scale-125 duration-200">
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

function getSongsbyPlaylist(id) {
  axios.get(`/api/playlists/songs/${id}`)
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
                <a href="/artista/${song.artist_id}" class="lg:text-lg text-sm text-start text-gray-400 hover:underline">${song.artist_name}</a>
              </div>
            </div>

            </td>
            <td class="hidden md:table-cell p-4 lg:text-lg text-sm text-start text-gray-400">${song.duration}</td>
            
            <td class="p-4 relative">
              <button onclick="" class="cursor-pointer hover:scale-125 duration-200">
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
  
function updatePlaylist() {
  const form = document.getElementById('form-editar');
  const id = form.dataset.playlistId;

  const name = form.querySelector('input[name="name"]').value;
  const description = form.querySelector('input[name="description"]').value;

  axios.put(`/api/playlists/update/${id}`, {
    name,
    description
  })
    .then(response => {
      console.log(response.data);
      Swal.fire('Actualizado', 'Playlist actualizada correctamente', 'success');
      cerrarModalEditar();
      getPlaylistById(playlistId);
    })
    .catch(error => {
      console.log(error);
      Swal.fire('Error', 'No se pudo actualizar la playlist', 'error');
    });
}

function confirmarEliminacion(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      deletePlaylist(id);
    }
  });
}

function deletePlaylist(id) {
  axios.delete(`/api/playlists/delete/${id}`)
    .then(response => {
      Swal.fire(
        'Eliminado',
        'La playlist ha sido eliminada correctamente.',
        'success'
      );
      getPlaylistById(playlistId);
      console.log(response.data);
    })
    .catch(error => {
      Swal.fire(
        'Error',
        'No se pudo eliminar la playlist.',
        'error'
      );
      console.error(error);
    });
}
  