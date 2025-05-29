document.addEventListener('DOMContentLoaded', () => {
    getGenres();
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
          <td class="p-3 px-5 flex justify-end">
            <button class="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 mr-4 rounded">Editar</button>
            <button onclick='deleteGenre(${genre.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
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
    })
    .catch(error => {
        console.log(error);
    });
}

function deleteGenre(id) {
    axios.delete(`/api/genres/delete/${id}`)
        .then(response => {
            console.log(response.data);
            getGenres();
        })
        .catch(error => {
            console.log(error);
        });
}