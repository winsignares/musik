document.addEventListener('DOMContentLoaded', () => {
  getUsers();
});

document.addEventListener('DOMContentLoaded', () => {
  getArtists();
});

document.addEventListener('DOMContentLoaded', () => {
  getSongs();
});

function abrirModalAgregarArtista() {
  document.getElementById('modal-agregar').classList.remove('hidden');
  document.getElementById('modal-agregar').classList.add('flex');
}

function cerrarModalAgregarArtista() {
  document.getElementById('modal-agregar').classList.remove('flex');
  document.getElementById('modal-agregar').classList.add('hidden');
  document.getElementById('form-agregar').reset();
}

function abrirModalEditarArtista(id) {
  document.getElementById('modal-editar').classList.remove('hidden');
  document.getElementById('modal-editar').classList.add('flex');

  axios.get(`/api/artists/get/${id}`)
    .then(response => {
      const artista = response.data;
      console.log(artista);

      document.querySelector('#form-editar input[name="name"]').value = artista.name;
      document.getElementById('form-editar').dataset.artistaId = id;

    })
    .catch(error => {
      Swal.fire(
        'Error',
        'No se pudo cargar el artista.',
        'error'
      );
      console.log(error);
    });
}

function cerrarModalEditarArtista() {
  document.getElementById('modal-editar').classList.remove('flex');
  document.getElementById('modal-editar').classList.add('hidden');
  document.getElementById('form-editar').reset();
}

function getArtists() {
  axios.get('/api/artists/get')
    .then(response => {
      const artists = response.data;
      const tbody = document.getElementById('tabla-artistas');
      tbody.innerHTML = '';

      artists.forEach(artist => {
        const row = document.createElement('tr');
        row.className = "border-b hover:bg-orange-100 bg-gray-100";

        row.innerHTML = `
          <td class="p-3 px-5">${artist.id}</td>
          <td class="p-3 px-5">${artist.name}</td>
          <td class="p-3 px-5 flex justify-end">
            <button onclick='abrirModalEditarArtista(${artist.id})' class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='confirmarEliminacionArtista(${artist.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error(error);
    });
}

function registerArtist() {
  const nameInput = document.getElementById('nombre-artista');
  const imageInput = document.getElementById('imagen-artista');

  const formData = new FormData();
  formData.append('name', nameInput.value);
  formData.append('image', imageInput.files[0]);

  axios.post('/api/artists/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      console.log(response.data);
      cerrarModalAgregar();
      getArtists();
      Swal.fire({
        icon: 'success',
        title: '¡Artista agregado!',
        text: 'El artista fue registrado correctamente.',
      });
    })
    .catch(error => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar el artista.'
      });
    });
}

function confirmarEliminacionArtista(id) {
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
      deleteArtist(id);
    }
  });
}

function deleteArtist(id) {
  axios.delete(`/api/artists/delete/${id}`)
    .then(response => {
      Swal.fire(
        'Eliminado',
        'El artista ha sido eliminado correctamente.',
        'success'
      );
      getArtists();
      console.log(response.data);
    })
    .catch(error => {
      Swal.fire(
        'Error',
        'No se pudo eliminar el artista.',
        'error'
      );
      console.error(error);
    });
}

function updateArtist() {
  const form = document.getElementById('form-editar');
  const id = form.dataset.artistaId;

  const name = form.querySelector('input[name="name"]').value;
  const imageInput = form.querySelector('input[name="image"]');
  const imageFile = imageInput.files[0];

  const formData = new FormData();
  formData.append('name', name);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  axios.put(`/api/artists/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      console.log(response.data);
      Swal.fire('Actualizado', 'Artista actualizado correctamente', 'success');
      cerrarModalEditar();
      getArtists();
    })
    .catch(error => {
      console.log(error);
      Swal.fire('Error', 'No se pudo actualizar el artista', 'error');
    });
}

function getUsers() {
  axios.get('/api/admin/get')
    .then(response => {
      const users = response.data;
      const tbody = document.getElementById('tabla-usuarios');
      tbody.innerHTML = '';

      users.forEach(user => {
        const row = document.createElement('tr');
        row.className = "border-b hover:bg-orange-100 bg-gray-100";

        row.innerHTML = `
          <td class="p-3 px-5">${user.id}</td>
          <td class="p-3 px-5">${user.name}</td>
          <td class="p-3 px-5">${user.lastName}</td>
          <td class="p-3 px-5">${user.birthDate}</td>
          <td class="p-3 px-5">${user.phoneNumber}</td>
          <td class="p-3 px-5">${user.email}</td>
          <td class="p-3 px-5 flex justify-end">
            <button onclick='confirmarEliminacionUser(${user.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error al obtener usuarios:', error);
    });
}

function confirmarEliminacionUser(id) {
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
      deleteUser(id);
    }
  });
}

function deleteUser(id) {
  axios.delete(`/api/admin/delete/${id}`)
    .then(response => {
      console.log(response.data);
      Swal.fire(
        'Eliminado',
        'El usuario ha sido eliminado correctamente.',
        'success'
      );

    })
    .catch(error => {
      console.log(error);
      Swal.fire(
        'Error',
        'No se pudo eliminar el usuario.',
        'error'
      );
    });
}

function logout() {
  axios.post('/api/users/logout')
    .then(() => {
      window.location.href = '/';
    });
}

function abrirModalAgregarGenero() {
  cargarGenerosPadre();
  document.getElementById('form-agregar').reset();
  document.getElementById('modal-agregar').classList.remove('hidden');
  document.getElementById('modal-agregar').classList.add('flex');
}

function cerrarModalAgregarGenero() {
  document.getElementById('modal-agregar').classList.remove('flex');
  document.getElementById('modal-agregar').classList.add('hidden');
  document.getElementById('form-agregar').reset();
}

function abrirModalEditarGenero(id) {
  document.getElementById('modal-editar').classList.remove('hidden');
  document.getElementById('modal-editar').classList.add('flex');

  axios.get(`/api/genres/get/${id}`)
    .then(response => {
      const genero = response.data;
      console.log(genero);

      document.querySelector('#form-editar input[name="name"]').value = genero.name;
      document.querySelector('#form-editar input[name="description"]').value = genero.description;

      document.getElementById('form-editar').dataset.generoId = id;

    })
    .catch(error => {
      Swal.fire(
        'Error',
        'No se pudo cargar el género.',
        'error'
      );
      console.log(error);
    });
}

function cerrarModalEditarGenero() {
  document.getElementById('modal-editar').classList.remove('flex');
  document.getElementById('modal-editar').classList.add('hidden');
  document.getElementById('form-editar').reset();
}

function getGenres() {
  axios.get('/api/genres/get')
    .then(response => {
      const genres = response.data;
      const tbody = document.getElementById('tabla-generos');
      tbody.innerHTML = '';

      genres.forEach(genre => {
        const row = document.createElement('tr');
        row.className = "border-b hover:bg-orange-100 bg-gray-100";

        row.innerHTML = `
          <td class="p-3 px-5">${genre.id}</td>
          <td class="p-3 px-5">${genre.name}</td>
          <td class="p-3 px-5">${genre.description}</td>
          <td class="p-3 px-5">${genre.fatherId}</td>
          <td class="p-3 px-5 flex justify-end">
            <button onclick='abrirModalEditarGenero(${genre.id})' class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='confirmarEliminacionGenero(${genre.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error(error);
    });
}

function cargarGenerosPadre() {
  axios.get('/api/genres/get')
    .then(response => {
      const select = document.getElementById('genero-padre');
      select.innerHTML = '<option value="">-- Sin género padre (género principal) --</option>';
      response.data.forEach(genero => {
        const option = document.createElement('option');
        option.value = genero.id;
        option.textContent = genero.name;
        select.appendChild(option);
      });
    })
    .catch(error => {
      console.error('Error al cargar géneros:', error);
    });
}

function registerGenre() {
  const form = document.getElementById('form-agregar');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  axios.post('/api/genres/register', data)
    .then(response => {
      console.log(response.data);
      cerrarModalAgregar();
      getGenres();
      Swal.fire({
        icon: 'success',
        title: '¡Género agregado!',
        text: 'El género fue registrado correctamente.',
      });
    })
    .catch(error => {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo agregar el género.'
      });
    });
}

function confirmarEliminacionGenero(id) {
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
      deleteGenre(id);
    }
  });
}

function deleteGenre(id) {
  axios.delete(`/api/genres/delete/${id}`)
    .then(response => {
      Swal.fire(
        'Eliminado',
        'El género ha sido eliminado correctamente.',
        'success'
      );
      getGenres();
      console.log(response.data);
    })
    .catch(error => {
      Swal.fire(
        'Error',
        'No se pudo eliminar el género.',
        'error'
      );
      console.error(error);
    });
}

function updateGenre() {
  const form = document.getElementById('form-editar');
  const id = form.dataset.generoId;

  const name = form.querySelector('input[name="name"]').value;
  const description = form.querySelector('input[name="description"]').value;

  axios.put(`/api/genres/update/${id}`, {
    name,
    description
  })
    .then(response => {
      console.log(response.data);
      Swal.fire('Actualizado', 'Género actualizado correctamente', 'success');
      cerrarModalEditar();
      getGenres();
    })
    .catch(error => {
      console.log(error);
      Swal.fire('Error', 'No se pudo actualizar el género', 'error');
    });
}

function abrirModalAgregarCancion() {
  cargarArtistas('select-artista');
  cargarGeneros('select-genero');

  const modal = document.getElementById('modal-agregar');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function cerrarModalAgregarCancion() {
  document.getElementById('modal-agregar').classList.remove('flex');
  document.getElementById('modal-agregar').classList.add('hidden');
  document.getElementById('form-agregar').reset();
}

function abrirModalEditarCancion(id) {
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

function cerrarModalEditarCancion() {
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
            <button onclick='abrirModalEditarCancion(${song.id})' class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='confirmarEliminacionCancion(${song.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
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

function confirmarEliminacionCancion(id) {
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