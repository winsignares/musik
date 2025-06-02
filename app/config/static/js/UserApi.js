document.addEventListener('DOMContentLoaded', getUserbyId);

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

function updateUser() {
  const form = document.getElementById('form-editar');
  const id = document.body.dataset.userId;

  const name = form.querySelector('input[name="name"]').value;
  const lastName = form.querySelector('input[name="lastName"]').value;
  const birthDate = form.querySelector('input[name="birthDate"]').value;
  const phoneNumber = form.querySelector('input[name="phoneNumber"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const password = form.querySelector('input[name="password"]').value;

  axios.put(`/api/users/update/${id}`, {
    name,
    lastName,
    birthDate,
    phoneNumber,
    email,
    password
  })

  .then(response => {
  console.log(response.data);
  Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success')
    .then(() => {
      window.location.href = '/principal';
    });
})

  .catch(error => {
    console.log(error);
    Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
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
      deleteUser(id);
    }
  });
}

function deleteUser(id) {
  axios.delete(`/api/users/delete/${id}`)
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

function login(event) {
  event.preventDefault(); 

  const form = document.getElementById('form');
  const email = form.email.value;
  const password = form.password.value;

  axios.post('/api/users/login', { email, password })
    .then(response => {
      const user = response.data;

      if (user.role === 'admin') {
        window.location.href = '/adminUsers';
      } else {
        window.location.href = '/principal';
      }
    })
    .catch(error => {
      console.log(error);
      Swal.fire('Error', 'Correo o contraseña incorrectos', 'error');
    });
}

function logout() {
  axios.post('/api/users/logout')
    .then(() => {
      window.location.href = '/';
    });
}

function getUserbyId() {
  const userId = document.body.getAttribute('data-user-id');
  axios.get(`/api/users/get/${userId}`)  
    .then(response => {
      const user = response.data;
      document.querySelector('input[name="name"]').value = user.name || '';
      document.querySelector('input[name="lastName"]').value = user.lastName || '';
      document.querySelector('input[name="birthDate"]').value = user.birthDate || '';
      document.querySelector('input[name="phoneNumber"]').value = user.phoneNumber || '';
      document.querySelector('input[name="email"]').value = user.email || '';
    })
    .catch(console.error);
}







