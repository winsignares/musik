document.addEventListener('DOMContentLoaded', () => {
  getUsers();
});

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
            <button onclick='deleteUser(${user.id})' class="cursor-pointer bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded">Eliminar</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Error al obtener usuarios:', error);
    });
}

function registerUser() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    axios.post('/api/users/register', data)
    .then(response => {
        console.log(response.data)
        window.location.href='/sesion';
    })
    .catch(error => {
        console.log(error);
    });
}

function login() {

}

function deleteUser(id) {
    axios.delete(`/api/admin/delete/${id}`)
        .then(response => {
            console.log(response.data);
            getUsers();
        })
        .catch(error => {
            console.log(error);
        });
}
