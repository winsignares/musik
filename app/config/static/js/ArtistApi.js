document.addEventListener('DOMContentLoaded', () => {
  getArtists();
});

function abrirModalAgregar() {
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

function cerrarModalEditar() {
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
            <button onclick='abrirModalEditar(${artist.id})' class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='confirmarEliminacion(${artist.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
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
