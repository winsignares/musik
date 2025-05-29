document.addEventListener('DOMContentLoaded', () => {
    getSongs();
});

function abrirModalAgregar() {
  cargarArtistas();
  cargarGeneros();

  const modal = document.getElementById('modal-agregar');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function cerrarModalAgregar() {
    document.getElementById('modal-agregar').classList.remove('flex');
    document.getElementById('modal-agregar').classList.add('hidden');
    document.getElementById('form-agregar').reset();
}

function cargarArtistas() {
  axios.get('/api/artists/get')
    .then(response => {
      const artistas = response.data;
      const select = document.getElementById('select-artista');
      select.innerHTML = '<option value="">Seleccione un artista</option>';
      artistas.forEach(artista => {
        const option = document.createElement('option');
        option.value = artista.id;
        option.textContent = artista.name;
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error al cargar artistas:', error));
}

function cargarGeneros() {
  axios.get('/api/genres/get')
    .then(response => {
      const generos = response.data;
      const select = document.getElementById('select-genero');
      select.innerHTML = '<option value="">Seleccione un género</option>';
      generos.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.id;
        option.textContent = genero.name;
        select.appendChild(option);
      });
    })
    .catch(error => console.error('Error al cargar géneros:', error));
}

function getSongs() {
    axios.get('/api/songs/get')
        .then(response => {
            const songs = response.data;
            const tbody = document.getElementById('tabla-canciones');
            tbody.innerHTML = '';

            songs.forEach(song => {
                const row = document.createElement('tr');
                row.className = "border-b hover:bg-orange-100 bg-gray-100";

                row.innerHTML = `
          <td class="p-3 px-5">${song.id}</td>
          <td class="p-3 px-5">${song.name}</td>
          <td class="p-3 px-5">${song.artist}</td>
          <td class="p-3 px-5">${song.genre}</td>
          <td class="p-3 px-5">${song.duration}</td>
          <td class="p-3 px-5">${song.date}</td>
          <td class="p-3 px-5">${song.author}</td>
          <td class="p-3 px-5 flex justify-end">
            <button class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='confirmarEliminacion(${song.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
          </td>
        `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error(error);
        });
}

function registerSong() {
  const form = document.getElementById('form-agregar');
  const formData = new FormData(form);

  axios.post('/api/songs/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  .then(response => {
    console.log(response.data);
    cerrarModalAgregar();
    getSongs(); 
    Swal.fire({
      icon: 'success',
      title: '¡Canción agregada!',
      text: 'La canción fue registrada correctamente.',
    });
  })
  .catch(error => {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo agregar la canción.'
    });
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
      deleteSong(id);
    }
  });
}

function deleteSong(id) {
    axios.delete(`/api/songs/delete/${id}`)
        .then(response => {
            console.log(response.data);
            getSongs();
        })
        .catch(error => {
            console.log(error);
        });
}