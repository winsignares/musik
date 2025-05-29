document.addEventListener('DOMContentLoaded', () => {
    getSongs();
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
          <td class="p-3 px-5">${song.author}</td>
          <td class="p-3 px-5">${song.duration}</td>
          <td class="p-3 px-5">${song.date}</td>
          <td class="p-3 px-5 flex justify-end">
            <button class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='deleteSong(${song.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
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
    const data = Object.fromEntries(formData.entries());

    axios.post('/api/songs/register', data)
    .then(response => {
        console.log(response.data);
        cerrarModalAgregar();
        getSongs();
    })
    .catch(error => {
        console.log(error);
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