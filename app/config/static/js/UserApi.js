function getUsers() {
    return fetch('/api/users')
        .then(response => response.json())
        .catch(error => console.error('Error fetching users:', error));
}

function registerUser() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    axios.post('/api/users/register', data)
    .then(response => {
        console.log(response); // <-- esto te mostrará toda la respuesta
        const msg = response.data.error || "Usuario registrado correctamente.";
        alert(msg); // aquí usas msg, no "mensaje"
        document.getElementById('fila').innerHTML = '';
        fetchUsers();
    })
    .catch(error => {
        console.log(error); // <-- importante para ver si realmente es un error
        const msg = error.response?.data?.error || "Error al registrar el usuario.";
        alert(msg);
    });

}
