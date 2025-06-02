document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('playlist-detail-container');
    const playlistId = container?.dataset?.playlistId;
  
    console.log('DOM loaded, container:', container);
    console.log('Playlist ID:', playlistId);
  
    if (playlistId) {
      getPlaylistById(playlistId);
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
          </div>
          `;
      })
      .catch(error => {
        console.error('Error al cargar playlist:', error);
      });
  }
  
  