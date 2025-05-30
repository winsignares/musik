function registerUser() {
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    axios.post('/api/users/register', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        // Registro exitoso
        console.log(response.data);
        alert(response.data.mensaje); // Mostrar mensaje antes de redirigir
        window.location.href = '/sesion'; // Redirección
    })
    .catch(error => {
        // Manejo de errores
        if (error.response) {
            const msg = error.response.data.error || "Error al registrar el usuario.";
            alert(msg); // Mostrar el error al usuario
        } else {
            alert("Error de conexión con el servidor.");
        }
        console.error(error);
    });
}


function login() {
    const form = document.getElementById('login-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    axios.post('/api/users/login', JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        alert(response.data.mensaje);
        window.location.href = "/registro"; // Redirige tras login exitoso
    })
    .catch(error => {
        const msg = error.response?.data?.error || "Error al iniciar sesión.";
        alert(msg);
    });
}
