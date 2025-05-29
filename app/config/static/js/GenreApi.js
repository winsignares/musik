document.addEventListener('DOMContentLoaded', () => {
  getGenres();
});

function abrirModalAgregar() {
  cargarGenerosPadre();
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

function cerrarModalEditar() {
  document.getElementById('modal-editar').classList.remove('flex');
  document.getElementById('modal-editar').classList.add('hidden');
  document.getElementById('form-editar').reset();
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
            <button onclick='abrirModalEditar(${genre.id})' class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='confirmarEliminacion(${genre.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error(error);
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
