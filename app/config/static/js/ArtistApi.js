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
            <button class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='deleteArtist(${artist.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
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
        })
        .catch(error => {
            console.error(error);
        });
}

function deleteArtist(id) {
    axios.delete(`/api/artists/delete/${id}`)
        .then(response => {
            console.log(response.data);
            getArtists();
        })
        .catch(error => {
            console.log(error);
        });
}