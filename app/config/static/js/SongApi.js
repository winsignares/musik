document.addEventListener('DOMContentLoaded', () => {
  getSongs();
});

function abrirModalAgregar() {
  cargarArtistas('select-artista');
  cargarGeneros('select-genero');

  const modal = document.getElementById('modal-agregar');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function cerrarModalAgregar() {
  document.getElementById('modal-agregar').classList.remove('flex');
  document.getElementById('modal-agregar').classList.add('hidden');
  document.getElementById('form-agregar').reset();
}

function abrirModalEditar(id) {
  document.getElementById('modal-editar').classList.remove('hidden');
  document.getElementById('modal-editar').classList.add('flex');

  Promise.all([
    cargarArtistas('select-artista-editar'),
    cargarGeneros('select-genero-editar'),
    axios.get(`/api/songs/get/${id}`)
  ])
  .then(([_, __, response]) => {
    const song = response.data;

    const artistSelect = document.getElementById('select-artista-editar');
    const genreSelect = document.getElementById('select-genero-editar');

    song.artist_ids.forEach(id => {
      const option = artistSelect.querySelector(`option[value="${id}"]`);
      if (option) option.selected = true;
    });
    song.genre_ids.forEach(id => {
      const option = genreSelect.querySelector(`option[value="${id}"]`);
      if (option) option.selected = true;
    });

    const form = document.querySelector('#form-editar');
    form.name.value = song.name;
    form.author.value = song.author;
    form.duration.value = song.duration;
    form.date.value = song.date;
    form.dataset.artistaId = id;
  })
  .catch(error => {
    Swal.fire('Error', 'No se pudo cargar la canción.', 'error');
    console.log(error);
  });
}

function cerrarModalEditar() {
  document.getElementById('modal-editar').classList.remove('flex');
  document.getElementById('modal-editar').classList.add('hidden');
  document.getElementById('form-editar').reset();
}

function cargarArtistas(selectId) {
  axios.get('/api/artists/get')
    .then(response => {
      const artistas = response.data;
      const select = document.getElementById(selectId);
      select.innerHTML = '';
      artistas.forEach(artista => {
        const option = document.createElement('option');
        option.value = artista.id;
        option.textContent = artista.name;
        select.appendChild(option);
      });
    })
    .catch(console.error);
}

function cargarGeneros(selectId) {
  axios.get('/api/genres/get')
    .then(response => {
      const generos = response.data;
      const select = document.getElementById(selectId);
      select.innerHTML = '';
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
            <button onclick='abrirModalEditar(${song.id})' class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
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

  const artistSelect = document.getElementById('select-artista');
  const selectedArtists = Array.from(artistSelect.selectedOptions).map(option => option.value);

  const genreSelect = document.getElementById('select-genero');
  const selectedGenres = Array.from(genreSelect.selectedOptions).map(option => option.value);

  formData.delete('artist');
  formData.delete('genre');

  selectedArtists.forEach(artistId => {
    formData.append('artist', artistId);
  });

  selectedGenres.forEach(genreId => {
    formData.append('genre', genreId);
  });

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
      Swal.fire(
        'Eliminado',
        'La canción ha sido eliminado correctamente.',
        'success'
      );
      getSongs();
      console.log(response.data);
    })
    .catch(error => {
      Swal.fire(
        'Error',
        'No se pudo eliminar la canción.',
        'error'
      );
      console.error(error);
    });
}

function updateSong() {
  const form = document.getElementById('form-editar');
  const id = form.dataset.artistaId;

  const name = form.querySelector('input[name="name"]').value;
  const author = form.querySelector('input[name="author"]').value;
  const duration = form.querySelector('input[name="duration"]').value;
  const date = form.querySelector('input[name="date"]').value;
  const coverFile = form.querySelector('input[name="cover"]').files[0];
  const mp3File = form.querySelector('input[name="mp3file"]').files[0];

  // Obtener artistas seleccionados
  const artistSelect = document.getElementById('select-artista');
  const selectedArtists = Array.from(artistSelect.selectedOptions).map(option => option.value);

  // Obtener géneros seleccionados
  const genreSelect = document.getElementById('select-genero');
  const selectedGenres = Array.from(genreSelect.selectedOptions).map(option => option.value);

  const formData = new FormData();
  formData.append('name', name);
  formData.append('author', author);
  formData.append('duration', duration);
  formData.append('date', date);

  if (coverFile) {
    formData.append('cover', coverFile);
  }

  if (mp3File) {
    formData.append('mp3file', mp3File);
  }

  // Añadir múltiples valores para artist y genre
  selectedArtists.forEach(id => formData.append('artist', id));
  selectedGenres.forEach(id => formData.append('genre', id));

  axios.put(`/api/songs/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then(response => {
    Swal.fire('Actualizado', 'Canción actualizada correctamente', 'success');
    cerrarModalEditar();
    getSongs(); // Asumiendo que tienes una función para refrescar la lista
  })
  .catch(error => {
    console.error(error);
    Swal.fire('Error', 'No se pudo actualizar la canción', 'error');
  });
}



